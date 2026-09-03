import { assetLinksStatements } from '@/lib/deeplinks'

/**
 * Android App Links verification file, served at /.well-known/assetlinks.json
 * through a rewrite in next.config.mjs.
 *
 * This is a route handler rather than a file in public/ so the fingerprints
 * stay in one place (src/lib/deeplinks.ts) and the response headers are
 * explicit. Android rejects the statement if the Content-Type is not
 * application/json, and reports nothing when it does — the link just opens in
 * the browser instead of the app.
 */
export async function GET() {
  return new Response(JSON.stringify(assetLinksStatements(), null, 2) + '\n', {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=3600',
    },
  })
}
