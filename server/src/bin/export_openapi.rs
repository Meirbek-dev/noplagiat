//! Writes the OpenAPI contract to `contracts/openapi.json` (or a path given
//! as the first argument). With `--check`, exits non-zero if the file on disk
//! differs from the generated document - used as a CI gate.

use std::path::PathBuf;
use std::process::ExitCode;

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let check = args.iter().any(|a| a == "--check");
    let path: PathBuf = args
        .iter()
        .find(|a| !a.starts_with("--"))
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("../contracts/openapi.json"));

    let generated = match api::openapi_json() {
        Ok(json) => json,
        Err(err) => {
            eprintln!("failed to render OpenAPI document: {err}");
            return ExitCode::FAILURE;
        }
    };

    if check {
        match std::fs::read_to_string(&path) {
            Ok(on_disk) if on_disk.trim() == generated.trim() => {
                println!("contract up to date: {}", path.display());
                ExitCode::SUCCESS
            }
            Ok(_) => {
                eprintln!(
                    "contract drift: {} differs from generated document - run `cargo run --bin export-openapi`",
                    path.display()
                );
                ExitCode::FAILURE
            }
            Err(err) => {
                eprintln!("cannot read {}: {err}", path.display());
                ExitCode::FAILURE
            }
        }
    } else {
        if let Some(parent) = path.parent()
            && let Err(err) = std::fs::create_dir_all(parent)
        {
            eprintln!("cannot create {}: {err}", parent.display());
            return ExitCode::FAILURE;
        }
        match std::fs::write(&path, format!("{generated}\n")) {
            Ok(()) => {
                println!("wrote {}", path.display());
                ExitCode::SUCCESS
            }
            Err(err) => {
                eprintln!("cannot write {}: {err}", path.display());
                ExitCode::FAILURE
            }
        }
    }
}
