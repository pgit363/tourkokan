'use client'

import { useLang } from '@/context/LanguageContext'
import LeadRows from '../../LeadRows'

/** `/vendor/leads` — the working view of enquiries: filter, page, mark as read. */
export default function VendorLeadsPage() {
  const { t } = useLang()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">{t.vendorDash.navLeads}</h1>
      <LeadRows filterable />
    </div>
  )
}
