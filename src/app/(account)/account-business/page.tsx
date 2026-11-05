import { redirect } from 'next/navigation'

/**
 * Moved to `/vendor/products`.
 *
 * Managing a catalog is not a personal account setting, and this page had grown to
 * carry both the outlet list and an add-product form while sitting between "Saved
 * lists" and "Password". The dashboard it became is role-gated and has room for the
 * leads, analytics and plan screens that belong beside it.
 *
 * Kept as a redirect rather than deleted: the path is in the wild, in the app's
 * menus and in anything a vendor has bookmarked.
 */
export default function AccountBusinessPage() {
  redirect('/vendor/products')
}
