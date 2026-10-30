// Serves the built site the way the host does: static files, folder index
// pages, a redirect to the trailing-slash URL, 404.html for anything else,
// and brotli compression for text files.
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'
import sirv from 'sirv'

const root = new URL('../dist/client/', import.meta.url).pathname
const port = Number(process.env.PORT ?? 4173)
const files = sirv(root, { dev: false, etag: true })
const notFound = readFileSync(join(root, '404.html'))
const compressible = /^(text\/|application\/(javascript|json|xml|manifest\+json)|image\/svg\+xml)/

/** Buffers the response and brotli-compresses it when the client accepts it. */
function compress(req, res) {
  if (!/\bbr\b/.test(req.headers['accept-encoding'] ?? '')) return
  const chunks = []
  let head = [200, {}]
  const writeHead = res.writeHead.bind(res)
  const end = res.end.bind(res)
  res.writeHead = (status, headers = {}) => {
    head = [status, { ...headers }]
    return res
  }
  res.write = (chunk) => {
    chunks.push(Buffer.from(chunk))
    return true
  }
  res.end = (chunk) => {
    if (chunk && typeof chunk !== 'function') chunks.push(Buffer.from(chunk))
    let body = Buffer.concat(chunks)
    const [status, headers] = head
    const type = String(headers['Content-Type'] ?? res.getHeader('Content-Type') ?? '')
    if (compressible.test(type) && body.length > 1024) {
      body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } })
      headers['Content-Encoding'] = 'br'
      headers['Content-Length'] = body.length
    }
    writeHead(status, headers)
    return end(body)
  }
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = decodeURIComponent(url.pathname)
  const dir = join(root, path)
  if (!path.endsWith('/') && existsSync(dir) && statSync(dir).isDirectory()) {
    res.writeHead(308, { Location: `${path}/${url.search}` }).end()
    return
  }
  compress(req, res)
  files(req, res, () => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(notFound)
  })
}).listen(port, () => {
  console.log(`Serving dist/client on http://localhost:${port}`)
})
