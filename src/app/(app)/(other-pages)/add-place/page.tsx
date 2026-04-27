import { redirect } from 'next/navigation'

export default function AddPlacePage() {
  redirect('/download?reason=submit-place')
}
