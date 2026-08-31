//! `manage-users` - the account CLI for the internal contour (ADR-017 §3).
//!
//! Authentication is local, and this binary is the only thing that creates an
//! account or sets a password. That is the whole access-control story of the
//! bootstrap: the operator who can run a binary on the server host, against the
//! database, is the operator TZ §5 already routes role assignment through. No
//! HTTP endpoint mints an administrator, so no HTTP bug can.
//!
//! ```text
//! manage-users create-user --username admin --role admin
//! manage-users set-password --username admin
//! manage-users grant  --username dean.fac03 --role dean --faculty FAC03
//! manage-users revoke --username dean.fac03 --role dean --faculty FAC03
//! manage-users list
//! manage-users deactivate --username admin
//! manage-users activate   --username admin
//! ```
//!
//! # Where the password comes from
//!
//! From an interactive prompt with the terminal echo off, or from
//! `APP_ADMIN_PASSWORD` for the unattended path (CI, a provisioning script).
//! **Never from an argument**: a password on the command line is in the shell
//! history, in `ps` output, and in the process table of every other user on the
//! host. `--password` is not accepted, and passing it is an error that says so.
//!
//! Reads `APP_DATABASE_URL`. Exits non-zero on any failure, so a provisioning
//! script can rely on the status code.

use std::io::{IsTerminal as _, Write as _};
use std::process::ExitCode;
use std::time::Duration;

use anyhow::{Context, bail};
use api::auth::password;

const DATABASE_CONNECT_TIMEOUT: Duration = Duration::from_secs(5);

/// Environment variable carrying a password for the unattended path.
const PASSWORD_ENV: &str = "APP_ADMIN_PASSWORD";

const USAGE: &str = "\
usage: manage-users <command> [options]

  create-user  --username <name> [--role <role>] [--faculty <code>]
               [--department <code>] [--email <address>] [--display-name <text>]
               [--no-password]
  set-password --username <name>
  grant        --username <name> --role <role> [--faculty <code>] [--department <code>]
  revoke       --username <name> --role <role> [--faculty <code>] [--department <code>]
  list
  activate     --username <name>
  deactivate   --username <name>

roles: staff, dept_head, dean, ethics, compliance, admin
  `dean` requires --faculty, `dept_head` requires --department; the other four
  are university-wide and take no unit.

The password is read from an interactive prompt, or from the APP_ADMIN_PASSWORD
environment variable when there is no terminal. It is never taken from an
argument - that would put it in the shell history and in `ps` output.

environment: APP_DATABASE_URL, APP_ADMIN_PASSWORD (optional)";

#[derive(Debug, PartialEq, Eq)]
enum Command {
    CreateUser,
    SetPassword,
    Grant,
    Revoke,
    List,
    SetActive(bool),
}

#[derive(Debug, Default)]
struct Options {
    username: Option<String>,
    role: Option<String>,
    faculty: Option<String>,
    department: Option<String>,
    email: Option<String>,
    display_name: Option<String>,
    no_password: bool,
}

#[derive(Debug)]
struct Args {
    command: Command,
    options: Options,
}

fn parse_args(raw: impl IntoIterator<Item = String>) -> anyhow::Result<Args> {
    let mut iter = raw.into_iter();
    let Some(first) = iter.next() else {
        bail!("a command is required\n\n{USAGE}");
    };
    let command = match first.as_str() {
        "create-user" => Command::CreateUser,
        "set-password" => Command::SetPassword,
        "grant" => Command::Grant,
        "revoke" => Command::Revoke,
        "list" => Command::List,
        "activate" => Command::SetActive(true),
        "deactivate" => Command::SetActive(false),
        "--help" | "-h" | "help" => {
            println!("{USAGE}");
            std::process::exit(0);
        }
        other => bail!("unknown command `{other}`\n\n{USAGE}"),
    };

    let mut options = Options::default();
    while let Some(flag) = iter.next() {
        let mut value = || -> anyhow::Result<String> {
            iter.next()
                .ok_or_else(|| anyhow::anyhow!("{flag} needs a value\n\n{USAGE}"))
        };
        match flag.as_str() {
            "--username" => options.username = Some(value()?),
            "--role" => options.role = Some(value()?),
            "--faculty" => options.faculty = Some(value()?),
            "--department" => options.department = Some(value()?),
            "--email" => options.email = Some(value()?),
            "--display-name" => options.display_name = Some(value()?),
            "--no-password" => options.no_password = true,
            // Named explicitly rather than caught by the catch-all, so the
            // error explains *why* instead of looking like a typo.
            "--password" => bail!(
                "--password is not accepted: a password given as an argument is visible in the \
                 shell history and in `ps` output. Let the prompt ask for it, or set \
                 {PASSWORD_ENV}."
            ),
            "--help" | "-h" => {
                println!("{USAGE}");
                std::process::exit(0);
            }
            other => bail!("unknown argument `{other}`\n\n{USAGE}"),
        }
    }
    Ok(Args { command, options })
}

impl Options {
    fn username(&self) -> anyhow::Result<&str> {
        let username = self
            .username
            .as_deref()
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .ok_or_else(|| anyhow::anyhow!("--username is required\n\n{USAGE}"))?;
        // The login name travels in a URL-free JSON body, but it is also what
        // an operator types at a shell; keeping it to a predictable shape means
        // no surprises about trimming, case or quoting.
        if !username
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '-' | '_' | '@'))
        {
            bail!(
                "a login name may hold ASCII letters, digits and `.`, `-`, `_`, `@` only, got \
                 `{username}`"
            );
        }
        Ok(username)
    }

    /// The role, with the unit rule of ADR-012 §4 enforced here rather than
    /// left to fail silently.
    ///
    /// `RoleGrant::scope` reads a dean with no faculty as *no data*, so an
    /// incomplete grant is one that looks present in the admin screen and sees
    /// nothing. Refusing it at the CLI is where the operator can still fix it.
    fn role(&self) -> anyhow::Result<Option<domain::RoleKind>> {
        let Some(label) = self.role.as_deref().map(str::trim) else {
            return Ok(None);
        };
        let role = api::auth::parse_role(label).ok_or_else(|| {
            anyhow::anyhow!(
                "unknown role `{label}`; expected staff, dept_head, dean, ethics, compliance or \
                 admin"
            )
        })?;
        match role {
            domain::RoleKind::Dean if self.faculty.is_none() => {
                bail!("a `dean` grant must name its faculty: --faculty <code>")
            }
            domain::RoleKind::DeptHead if self.department.is_none() => {
                bail!("a `dept_head` grant must name its department: --department <code>")
            }
            domain::RoleKind::Dean | domain::RoleKind::DeptHead => {}
            _ if self.faculty.is_some() || self.department.is_some() => {
                bail!("`{label}` is a university-wide role and takes no --faculty or --department")
            }
            _ => {}
        }
        Ok(Some(role))
    }

    fn required_role(&self) -> anyhow::Result<domain::RoleKind> {
        self.role()?
            .ok_or_else(|| anyhow::anyhow!("--role is required for this command\n\n{USAGE}"))
    }
}

/// Read a password without echoing it, or take the unattended one.
///
/// `confirm` asks twice, because a mistyped password on `create-user` locks an
/// account nobody has signed into yet.
fn read_password(confirm: bool) -> anyhow::Result<String> {
    if let Ok(from_env) = std::env::var(PASSWORD_ENV) {
        if from_env.is_empty() {
            bail!("{PASSWORD_ENV} is set but empty");
        }
        password::check_strength(&from_env)
            .with_context(|| format!("{PASSWORD_ENV} is not acceptable"))?;
        return Ok(from_env);
    }
    if !std::io::stdin().is_terminal() {
        bail!(
            "no terminal to prompt on and {PASSWORD_ENV} is not set - set it for an unattended \
             run"
        );
    }

    let first = prompt_hidden("Password: ")?;
    password::check_strength(&first)?;
    if confirm {
        let second = prompt_hidden("Repeat password: ")?;
        if first != second {
            bail!("the two passwords do not match");
        }
    }
    Ok(first)
}

/// One hidden prompt.
///
/// Terminal echo is turned off through the platform's own console API and
/// restored on every path out, including the error one - a CLI that leaves a
/// terminal echoless after a failure is a bug the operator pays for.
fn prompt_hidden(label: &str) -> anyhow::Result<String> {
    print!("{label}");
    std::io::stdout().flush().ok();
    let guard = echo::disable()?;
    let mut line = String::new();
    let read = std::io::stdin().read_line(&mut line);
    drop(guard);
    println!();
    read.context("reading the password failed")?;
    Ok(line.trim_end_matches(['\r', '\n']).to_owned())
}

/// Turning terminal echo off, per platform.
///
/// Hand-rolled against the OS console API rather than pulling in a prompt
/// crate: it is one flag on one handle, and AGENTS.md §5 asks for a reason
/// before a dependency, not after.
mod echo {
    /// Restores the previous console mode when dropped.
    pub struct Guard(Option<Restore>);

    #[cfg(windows)]
    type Restore = u32;
    #[cfg(not(windows))]
    type Restore = libc_termios::Termios;

    #[cfg(windows)]
    mod sys {
        // `windows-sys` is not a dependency of this workspace and this is three
        // calls; declaring them directly keeps the dependency graph unchanged.
        unsafe extern "system" {
            pub fn GetStdHandle(which: u32) -> isize;
            pub fn GetConsoleMode(handle: isize, mode: *mut u32) -> i32;
            pub fn SetConsoleMode(handle: isize, mode: u32) -> i32;
        }
        pub const STD_INPUT_HANDLE: u32 = -10_i32 as u32;
        pub const ENABLE_ECHO_INPUT: u32 = 0x0004;
    }

    #[cfg(windows)]
    pub fn disable() -> anyhow::Result<Guard> {
        // SAFETY: three console calls on the process's own stdin handle, each
        // checked for failure. No pointer outlives the call it is passed to.
        unsafe {
            let handle = sys::GetStdHandle(sys::STD_INPUT_HANDLE);
            let mut mode: u32 = 0;
            if sys::GetConsoleMode(handle, &raw mut mode) == 0 {
                // Not a console (a pipe): nothing to turn off, and the caller
                // has already established there is a terminal on stdin.
                return Ok(Guard(None));
            }
            sys::SetConsoleMode(handle, mode & !sys::ENABLE_ECHO_INPUT);
            Ok(Guard(Some(mode)))
        }
    }

    #[cfg(windows)]
    impl Drop for Guard {
        fn drop(&mut self) {
            if let Some(mode) = self.0 {
                // SAFETY: restoring the mode this guard read at construction.
                unsafe {
                    let handle = sys::GetStdHandle(sys::STD_INPUT_HANDLE);
                    sys::SetConsoleMode(handle, mode);
                }
            }
        }
    }

    #[cfg(not(windows))]
    mod libc_termios {
        pub type Tcflag = u32;
        #[repr(C)]
        #[derive(Clone, Copy)]
        pub struct Termios {
            pub c_iflag: Tcflag,
            pub c_oflag: Tcflag,
            pub c_cflag: Tcflag,
            pub c_lflag: Tcflag,
            pub c_line: u8,
            pub c_cc: [u8; 32],
            pub c_ispeed: Tcflag,
            pub c_ospeed: Tcflag,
        }
        pub const ECHO: Tcflag = 0o10;
        pub const TCSANOW: i32 = 0;
        unsafe extern "C" {
            pub fn tcgetattr(fd: i32, termios: *mut Termios) -> i32;
            pub fn tcsetattr(fd: i32, actions: i32, termios: *const Termios) -> i32;
        }
    }

    #[cfg(not(windows))]
    pub fn disable() -> anyhow::Result<Guard> {
        use std::mem::MaybeUninit;
        // SAFETY: `tcgetattr` fills the struct or reports failure; nothing is
        // read out of it before that succeeds.
        unsafe {
            let mut current = MaybeUninit::<libc_termios::Termios>::uninit();
            if libc_termios::tcgetattr(0, current.as_mut_ptr()) != 0 {
                return Ok(Guard(None));
            }
            let previous = current.assume_init();
            let mut quiet = previous;
            quiet.c_lflag &= !libc_termios::ECHO;
            libc_termios::tcsetattr(0, libc_termios::TCSANOW, &raw const quiet);
            Ok(Guard(Some(previous)))
        }
    }

    #[cfg(not(windows))]
    impl Drop for Guard {
        fn drop(&mut self) {
            if let Some(previous) = self.0 {
                // SAFETY: restoring the attributes this guard read.
                unsafe {
                    libc_termios::tcsetattr(0, libc_termios::TCSANOW, &raw const previous);
                }
            }
        }
    }
}

fn required_env(name: &'static str) -> anyhow::Result<String> {
    let value = std::env::var(name)
        .with_context(|| format!("required environment variable {name} is not set"))?;
    if value.trim().is_empty() {
        bail!("required environment variable {name} is empty");
    }
    Ok(value)
}

/// Resolve a dictionary code to its id, refusing an unknown one.
async fn unit_ids(
    pool: &db::Pool,
    options: &Options,
) -> anyhow::Result<(Option<i64>, Option<i64>)> {
    let faculty = match options.faculty.as_deref() {
        Some(code) => Some(
            *db::dicts::faculty_ids(pool)
                .await?
                .get(code)
                .with_context(|| format!("no faculty `{code}` in the dictionaries"))?,
        ),
        None => None,
    };
    let department = match options.department.as_deref() {
        Some(code) => Some(
            *db::dicts::department_ids(pool)
                .await?
                .get(code)
                .with_context(|| format!("no department `{code}` in the dictionaries"))?,
        ),
        None => None,
    };
    Ok((faculty, department))
}

async fn run(args: Args) -> anyhow::Result<()> {
    let database: db::DatabaseConfig = required_env("APP_DATABASE_URL")?
        .parse()
        .context("APP_DATABASE_URL must be a valid PostgreSQL connection URL")?;
    let pool = tokio::time::timeout(DATABASE_CONNECT_TIMEOUT, db::connect(&database))
        .await
        .context("timed out connecting to PostgreSQL")?
        .context("failed to connect to PostgreSQL")?;
    // The same migrations the server applies at startup, so provisioning a
    // fresh deployment does not have to start the server first.
    db::migrate(&pool)
        .await
        .context("failed to apply database migrations")?;

    let options = &args.options;
    match args.command {
        Command::CreateUser => {
            let username = options.username()?;
            let role = options.role()?;
            let (faculty, department) = unit_ids(&pool, options).await?;

            let hash = if options.no_password {
                None
            } else {
                Some(password::hash(&read_password(true)?)?)
            };
            // An account row needs an address; a non-routable placeholder beats
            // inventing one, and TZ §6.1 exempts these service fields anyway.
            let email = options
                .email
                .clone()
                .unwrap_or_else(|| format!("{username}@local.invalid"));
            let display_name = options
                .display_name
                .clone()
                .unwrap_or_else(|| username.to_owned());

            let user =
                db::users::create(&pool, username, &email, &display_name, hash.as_deref()).await?;
            if let Some(role) = role {
                db::users::add_role(&pool, user.id, role, faculty, department).await?;
            }
            println!("created `{username}` (id {})", user.id);
            match role {
                Some(role) => println!("  granted {}", db::filters::role_label(role)),
                None => println!(
                    "  no role granted - the account lands on the request-access page until one is"
                ),
            }
            if hash.is_none() {
                println!("  no password set - it cannot sign in until `set-password` runs");
            }
        }

        Command::SetPassword => {
            let username = options.username()?;
            let user = db::users::by_username(&pool, username)
                .await?
                .with_context(|| format!("no account named `{username}`"))?;
            let hash = password::hash(&read_password(true)?)?;
            db::users::set_password(&pool, user.user.id, Some(&hash)).await?;
            println!(
                "password set for `{}`; its sessions were ended",
                user.user.username
            );
        }

        Command::Grant | Command::Revoke => {
            let username = options.username()?;
            let role = options.required_role()?;
            let (faculty, department) = unit_ids(&pool, options).await?;
            let user = db::users::by_username(&pool, username)
                .await?
                .with_context(|| format!("no account named `{username}`"))?;
            let label = db::filters::role_label(role);
            if args.command == Command::Grant {
                db::users::add_role(&pool, user.user.id, role, faculty, department).await?;
                println!("granted {label} to `{}`", user.user.username);
            } else {
                let removed =
                    db::users::remove_role(&pool, user.user.id, role, faculty, department).await?;
                if removed == 0 {
                    bail!("`{}` holds no such {label} grant", user.user.username);
                }
                println!("revoked {label} from `{}`", user.user.username);
            }
        }

        Command::List => {
            // One page, wide enough for an installation whose accounts are
            // counted in dozens (TZ §5 names six roles, not six thousand users).
            let accounts = db::users::list(&pool, 500, 0).await?;
            if accounts.is_empty() {
                println!("no accounts - `manage-users create-user --username <name> --role admin`");
            }
            for account in accounts {
                let roles: Vec<String> = account
                    .roles
                    .iter()
                    .map(
                        |grant| match (&grant.scope_faculty_code, &grant.scope_department_code) {
                            (Some(code), _) | (None, Some(code)) => {
                                format!("{}:{code}", grant.role)
                            }
                            (None, None) => grant.role.clone(),
                        },
                    )
                    .collect();
                println!(
                    "{:<24} {:<9} {}",
                    account.user.username,
                    if account.user.active {
                        "active"
                    } else {
                        "disabled"
                    },
                    if roles.is_empty() {
                        "-".to_owned()
                    } else {
                        roles.join(", ")
                    },
                );
            }
        }

        Command::SetActive(active) => {
            let username = options.username()?;
            let user = db::users::by_username(&pool, username)
                .await?
                .with_context(|| format!("no account named `{username}`"))?;
            db::users::set_active(&pool, user.user.id, active).await?;
            println!(
                "`{}` is now {}",
                user.user.username,
                if active {
                    "active"
                } else {
                    "deactivated; its sessions were ended"
                }
            );
        }
    }
    Ok(())
}

#[tokio::main]
async fn main() -> ExitCode {
    dotenvy::dotenv().ok();
    let args = match parse_args(std::env::args().skip(1)) {
        Ok(args) => args,
        Err(error) => {
            eprintln!("{error}");
            return ExitCode::FAILURE;
        }
    };
    match run(args).await {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("manage-users: {error:#}");
            ExitCode::FAILURE
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn args(raw: &[&str]) -> anyhow::Result<Args> {
        parse_args(raw.iter().map(|value| (*value).to_owned()))
    }

    fn options(raw: &[&str]) -> Options {
        args(raw).expect("the arguments parse").options
    }

    #[test]
    fn commands_and_flags_parse() {
        let parsed = args(&["create-user", "--username", "admin", "--role", "admin"])
            .expect("the arguments parse");
        assert_eq!(parsed.command, Command::CreateUser);
        assert_eq!(parsed.options.username.as_deref(), Some("admin"));
        assert_eq!(
            parsed.options.role().expect("the role parses"),
            Some(domain::RoleKind::Admin)
        );
        assert_eq!(
            args(&["deactivate", "--username", "a"])
                .expect("the arguments parse")
                .command,
            Command::SetActive(false)
        );
        assert!(args(&[]).is_err());
        assert!(args(&["frobnicate"]).is_err());
        assert!(args(&["list", "--nope"]).is_err());
        assert!(args(&["grant", "--username"]).is_err());
    }

    /// A password given as an argument would be in the shell history and in
    /// `ps` output. The flag is refused by name so the error can say why.
    #[test]
    fn a_password_cannot_be_passed_as_an_argument() {
        let error = args(&["create-user", "--username", "a", "--password", "hunter2"])
            .expect_err("--password is refused");
        assert!(
            error.to_string().contains("shell history"),
            "the refusal must explain itself: {error}"
        );
    }

    /// `RoleGrant::scope` reads a unit role with no unit as *no data*, so the
    /// CLI refuses to create that grant at all (ADR-012 §4).
    #[test]
    fn a_unit_role_must_name_its_unit_and_a_wide_role_must_not() {
        assert!(options(&["grant", "--role", "dean"]).role().is_err());
        assert!(options(&["grant", "--role", "dept_head"]).role().is_err());
        assert!(
            options(&["grant", "--role", "dean", "--faculty", "FAC03"])
                .role()
                .is_ok()
        );
        assert!(
            options(&["grant", "--role", "dept_head", "--department", "DEP11"])
                .role()
                .is_ok()
        );
        // A faculty on an admin grant is an operator who thinks the grant is
        // being narrowed. It is not - `RoleGrant::scope` widens admin to the
        // whole university either way, so the mistake is refused.
        assert!(
            options(&["grant", "--role", "admin", "--faculty", "FAC03"])
                .role()
                .is_err()
        );
        assert!(options(&["grant", "--role", "root"]).role().is_err());
        assert!(
            options(&["grant"])
                .role()
                .expect("absent is not an error")
                .is_none()
        );
        assert!(options(&["grant"]).required_role().is_err());
    }

    #[test]
    fn a_login_name_is_trimmed_and_kept_to_a_predictable_shape() {
        assert_eq!(
            options(&["grant", "--username", "  admin  "])
                .username()
                .expect("a name parses"),
            "admin"
        );
        assert_eq!(
            options(&["grant", "--username", "dean.fac03@tou.edu.kz"])
                .username()
                .expect("a name parses"),
            "dean.fac03@tou.edu.kz"
        );
        for rejected in ["", "   ", "a b", "имя", "a/b", "a;b"] {
            assert!(
                options(&["grant", "--username", rejected])
                    .username()
                    .is_err(),
                "`{rejected}` must not be a login name"
            );
        }
    }
}
