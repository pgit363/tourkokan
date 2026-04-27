import { redirect } from 'next/navigation'

export default function AddListingStepPage() {
  redirect('/download?reason=submit-place')
}
