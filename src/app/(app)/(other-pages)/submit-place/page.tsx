import { redirect } from 'next/navigation'

export default function SubmitPlacePage() {
  redirect('/download?reason=submit-place')
}
