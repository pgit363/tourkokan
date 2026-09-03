# Deep links — tourkokan.com

How a shared referral link (`https://tourkokan.com/invite/{code}`) opens the
Android app instead of the browser, and what is still outstanding.

**Scope: Android only.** iOS is not live yet — see [Later, when iOS goes live](#later-when-ios-goes-live).

**No API change is involved.** The backend already accepts and validates
`referral_code` on both register and Google sign-in. The code travels inside the
URL and the app reads it from there; this site never processes it.

---

## What is implemented here

| Path | Served by |
|---|---|
| `/.well-known/assetlinks.json` | [`src/app/api/well-known/assetlinks.json/route.ts`](../../src/app/api/well-known/assetlinks.json/route.ts), reached via a rewrite in [`next.config.mjs`](../../next.config.mjs) |
| `/invite/{code}` | [`src/app/(app)/(other-pages)/invite/[code]/page.tsx`](<../../src/app/(app)/(other-pages)/invite/[code]/page.tsx>) |

Both read their configuration from [`src/lib/deeplinks.ts`](../../src/lib/deeplinks.ts),
which is the only file to edit when a fingerprint or the store URL changes.

### Why a route handler and not `public/.well-known/assetlinks.json`

Two reasons. The fingerprint list stays in one place alongside the store-URL
helper, and the `Content-Type` is set explicitly rather than inferred — Android
rejects the statement if it is not `application/json` and reports nothing when
it does. It also sidesteps any question of how Cloudflare's asset pipeline
treats dot-directories.

The rewrite is internal, so the URL and the `200` are preserved and no
`Location` header is emitted. A `301`/`302` in front of this file fails
verification.

---

## ⚠️ Outstanding: the Play App Signing fingerprint

`SHA256_CERT_FINGERPRINTS` in [`src/lib/deeplinks.ts`](../../src/lib/deeplinks.ts)
currently holds **only the upload key**, taken from
`android/app/tourkokan-release.keystore`. That matches release builds installed
directly over USB.

If the app ships through Google Play with **Play App Signing** — the default —
Google re-signs it with its own key and Android verifies against *that*
fingerprint. Until it is added, deep links do not verify for anyone who
installed from the Play Store.

Get it from:

> **Play Console → Release → Setup → App signing → App signing key certificate → SHA-256**

**Keep both entries.** One matches Play installs, the other matches sideloaded
release builds used for testing.

---

## Serving requirements

Each of these breaks verification **silently** — no error, the link just opens
in the browser:

- `Content-Type: application/json`
- HTTPS with a valid certificate
- **No redirects.** A `301`/`302` to the file fails verification.
- Publicly reachable — no auth, no Cloudflare challenge, no geo-blocking
- No `.json` rewrite rules that alter the path

---

## The `/invite/{code}` page

**Only people who do NOT have the app ever see it.** Once the app is installed
and verified, Android intercepts the URL before a browser is involved. The page
exists so a referral link is not a dead end for new users — which is most
recipients of a referral.

It is a wildcard route because the code changes on every share. Codes outside
`[A-Za-z0-9_-]{1,64}` render the generic download CTA rather than a 404.

The Play Store link carries `&referrer=code%3D{code}`. That parameter survives
installation, so a fresh install can auto-apply the code later via the Play
Install Referrer API. Not wired up today, but it cannot be added retroactively
to links already shared.

The page shows a visible **Continue to Play Store** button rather than
redirecting instantly — an instant redirect looks broken when it fails and
leaves nowhere to show the referral context that motivated the tap.

---

## Verifying

### assetlinks.json

```bash
curl -sSI https://tourkokan.com/.well-known/assetlinks.json
```

Expect `200`, `content-type: application/json`, and **no** `location:` header.

Google's official validator:

```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://tourkokan.com&relation=delegate_permission/common.handle_all_urls
```

### On a device, after installing the app

```bash
adb shell pm get-app-links com.tourkokan
```

You want `verified` beside `tourkokan.com`. `legacy_failure` or unverified means
the fingerprint does not match — almost always the Play App Signing issue above.

Force a re-check without reinstalling:

```bash
adb shell pm verify-app-links --re-verify com.tourkokan
```

### End to end

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://tourkokan.com/invite/TESTCODE123" com.tourkokan
```

Before verification this shows a chooser dialog; after, it opens the app
directly. Then open Sign Up — the referral field should be prefilled.

---

## Later, when iOS goes live

iOS needs one more file on the same domain, at both:

```
https://tourkokan.com/.well-known/apple-app-site-association
https://tourkokan.com/apple-app-site-association          (fallback path)
```

Same serving rules, plus one iOS-specific trap: **the file must have no `.json`
extension.** Serve it the same way as `assetlinks.json` — a route handler plus
rewrites — so the extension and `Content-Type` are under our control.

The `/invite/{code}` page needs no change beyond adding an App Store button
alongside the Play Store one.
