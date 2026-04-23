'use client'

import { apiFetch } from '@/lib/api'
import { translations, Lang, Translations } from '@/i18n/translations'
import { createContext, useContext, useEffect, useState } from 'react'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('app_lang') as Lang | null
    if (stored === 'en' || stored === 'mr') setLangState(stored)
  }, [])

  const setLang = async (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem('app_lang', newLang)
    try {
      const form = new FormData()
      form.append('language', newLang)
      await apiFetch('/v2/updateProfile', { method: 'POST', body: form })
    } catch {
      // language preference saved locally even if API fails
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
