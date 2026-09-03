/**
 * Android App Links configuration for tourkokan.com.
 *
 * Single source of truth for the values Android checks when deciding whether a
 * tourkokan.com/invite/* link opens the app instead of the browser. The
 * /.well-known/assetlinks.json route reads this file.
 */

export const ANDROID_PACKAGE_NAME = 'com.tourkokan'

/**
 * SHA-256 certificate fingerprints Android accepts for the package above.
 *
 * Two entries are expected once the app ships through Play:
 *  - the upload key (android/app/tourkokan-release.keystore), which matches
 *    release builds installed directly over USB for testing
 *  - the Play App Signing key, which matches every install from Play, because
 *    Google re-signs the app with its own key
 *
 * Get the Play value from Play Console -> Release -> Setup -> App signing ->
 * App signing key certificate -> SHA-256, and add it below.
 *
 * A build whose fingerprint is missing here fails verification silently: links
 * open in the browser and nothing reports an error.
 */
export const SHA256_CERT_FINGERPRINTS = [
  // Upload key (android/app/tourkokan-release.keystore)
  '03:0D:2D:B4:8D:28:80:E8:0D:FC:10:D3:A6:B1:B4:3A:EA:B2:D6:0F:8E:53:EA:5B:05:93:21:61:9B:24:9A:53',
  // TODO: add the Play App Signing SHA-256 — until it is here, links do not
  // verify for anyone who installed the app from the Play Store.
]

/** The statement list served at /.well-known/assetlinks.json. */
export const assetLinksStatements = () => [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: ANDROID_PACKAGE_NAME,
      sha256_cert_fingerprints: SHA256_CERT_FINGERPRINTS,
    },
  },
]

/** Referral codes we are willing to echo back into a page or a store URL. */
const REFERRAL_CODE_PATTERN = /^[A-Za-z0-9_-]{1,64}$/

export const isValidReferralCode = (code: string): boolean => REFERRAL_CODE_PATTERN.test(code)

/**
 * Play Store URL for the app, carrying the referral code when we have one.
 *
 * The `referrer` parameter survives installation and can be read on first
 * launch via the Play Install Referrer API, so a fresh install can auto-apply
 * the code later. It cannot be added retroactively to links already shared.
 */
export const playStoreUrl = (referralCode?: string): string => {
  const base = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`
  if (!referralCode) {
    return base
  }
  return `${base}&referrer=${encodeURIComponent(`code=${referralCode}`)}`
}
