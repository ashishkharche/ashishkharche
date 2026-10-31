import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

/** Sent only by the build's prerender step when it renders 404.html. */
const notFoundPrerenderHeader = 'x-prerender-not-found'

// 404.html is served for every unknown URL, where the browser's router finds no route and renders the
// root not found page. So the build renders 404.html from an unknown URL too, and the HTML hydrates
// into the same tree. The prerender step only saves 200 responses, so that one request gets 200 here.
// The server bundle only runs during the build; the site itself is static files.
export default createServerEntry({
  async fetch(request, opts) {
    const response = await handler.fetch(request, opts)
    if (response.status !== 404 || request.headers.get(notFoundPrerenderHeader) !== '1') return response
    return new Response(response.body, { status: 200, headers: response.headers })
  },
})
