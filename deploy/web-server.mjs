import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, resolve, sep } from "node:path"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import { fileURLToPath, pathToFileURL } from "node:url"

const host = process.env.HOST ?? "0.0.0.0"
const port = parsePort(process.env.PORT ?? "3000")
const distDirectory = resolve(
  process.env.WEB_DIST_DIR ?? fileURLToPath(new URL("./dist", import.meta.url))
)
const clientDirectory = resolve(distDirectory, "client")
const serverEntry = resolve(distDirectory, "server/server.js")
const { default: startHandler } = await import(pathToFileURL(serverEntry).href)

if (typeof startHandler?.fetch !== "function") {
  throw new TypeError(`${serverEntry} does not export a Fetch handler`)
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
])

const server = createServer(async (request, response) => {
  try {
    if (await serveStaticAsset(request, response)) return

    const fetchRequest = toFetchRequest(request)
    const fetchResponse = await startHandler.fetch(fetchRequest)
    await sendFetchResponse(request, response, fetchResponse)
  } catch (error) {
    console.error("SSR request failed", error)
    if (response.headersSent) {
      response.destroy()
    } else {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" })
      response.end("Internal Server Error")
    }
  }
})

server.requestTimeout = 60_000
server.headersTimeout = 65_000
server.keepAliveTimeout = 5_000

server.listen(port, host, () => {
  console.log(`TanStack Start SSR listening on http://${host}:${port}`)
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    server.close((error) => {
      if (error) {
        console.error("SSR shutdown failed", error)
        process.exitCode = 1
      }
    })
    setTimeout(() => server.closeAllConnections(), 10_000).unref()
  })
}

function parsePort(value) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) {
    throw new RangeError(
      `PORT must be an integer from 1 to 65535, received ${value}`
    )
  }
  return parsed
}

async function serveStaticAsset(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") return false

  const requestUrl = new URL(request.url ?? "/", "http://localhost")
  let pathname
  try {
    pathname = decodeURIComponent(requestUrl.pathname)
  } catch {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" })
    response.end("Bad Request")
    return true
  }

  if (pathname.endsWith("/") || pathname.includes("\0")) return false

  const assetPath = resolve(clientDirectory, `.${pathname}`)
  if (!assetPath.startsWith(`${clientDirectory}${sep}`)) return false

  let assetStat
  try {
    assetStat = await stat(assetPath)
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTDIR") return false
    throw error
  }
  if (!assetStat.isFile()) return false

  const headers = {
    "cache-control": pathname.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate",
    "content-length": String(assetStat.size),
    "content-type":
      contentTypes.get(extname(assetPath).toLowerCase()) ??
      "application/octet-stream",
  }
  response.writeHead(200, headers)
  if (request.method === "HEAD") {
    response.end()
  } else {
    await pipeline(createReadStream(assetPath), response)
  }
  return true
}

function toFetchRequest(request) {
  const forwardedProtocol = firstHeaderValue(
    request.headers["x-forwarded-proto"]
  )
  const forwardedHost = firstHeaderValue(request.headers["x-forwarded-host"])
  const protocol = forwardedProtocol ?? "http"
  const authority = forwardedHost ?? request.headers.host ?? `localhost:${port}`
  const url = new URL(request.url ?? "/", `${protocol}://${authority}`)
  const method = request.method ?? "GET"
  const init = {
    headers: new Headers(request.headers),
    method,
  }

  if (method !== "GET" && method !== "HEAD") {
    init.body = Readable.toWeb(request)
    init.duplex = "half"
  }

  return new Request(url, init)
}

async function sendFetchResponse(request, response, fetchResponse) {
  response.statusCode = fetchResponse.status
  response.statusMessage = fetchResponse.statusText

  for (const [name, value] of fetchResponse.headers) {
    if (name !== "set-cookie") response.setHeader(name, value)
  }
  const cookies = fetchResponse.headers.getSetCookie()
  if (cookies.length > 0) response.setHeader("set-cookie", cookies)

  if (request.method === "HEAD" || fetchResponse.body === null) {
    response.end()
    return
  }
  await pipeline(Readable.fromWeb(fetchResponse.body), response)
}

function firstHeaderValue(value) {
  if (Array.isArray(value)) return value[0]
  return value?.split(",", 1)[0]?.trim()
}
