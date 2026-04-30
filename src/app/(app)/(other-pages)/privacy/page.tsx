'use client'

import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'

const sectionsEn = [
  {
    id: '01',
    title: 'What We Collect',
    icon: '📋',
    items: [
      'Account Information — name, email address, mobile number',
      'Profile Data — optional photo, travel preferences, saved destinations',
      'Location Data — GPS (with your permission) to show nearby attractions',
      'Device Information — device type, OS version, IP address',
      'Usage Data — pages viewed, features used, search queries',
      'User Content — reviews, photos, comments you submit',
      'Support Communications — messages you send to our team',
    ],
  },
  {
    id: '02',
    title: 'How We Use Your Data',
    icon: '🔧',
    items: [
      'Provide, operate, and improve the App and its features',
      'Personalise your experience and recommend relevant destinations',
      'Send service-related notifications and respond to queries',
      'Detect and prevent fraud, abuse, and security incidents',
      'Analyse anonymised usage trends to improve our services',
      'Comply with legal obligations',
    ],
  },
  {
    id: '03',
    title: 'Data Security',
    icon: '🔒',
    content: `We implement industry-standard security measures including AES-256 encryption at rest, TLS/HTTPS transmission, and strict access controls. Despite these measures, no electronic system is 100% secure. We encourage you to use a strong password and notify us immediately if you suspect unauthorised access to your account at support@Tourkokan.com.`,
  },
  {
    id: '04',
    title: 'Sharing Your Information',
    icon: '🤝',
    content: `We do not sell your personal information. We may share data with: (a) Service Providers — cloud hosting, analytics, and payment processors who are contractually bound to handle data securely; (b) Legal Requirements — if required by law, court order, or to protect safety; (c) Business Transfers — if involved in a merger or acquisition.`,
  },
  {
    id: '05',
    title: 'Your Rights',
    icon: '⚖️',
    items: [
      'Access the personal information we hold about you',
      'Correct inaccurate or incomplete information',
      'Request deletion of your account and data (visit /delete-account)',
      'Withdraw location or marketing consent at any time via device settings',
      'Lodge a complaint with a data protection authority',
    ],
  },
  {
    id: '06',
    title: 'Data Retention',
    icon: '🗃️',
    content: `We retain your data for as long as your account is active. If you delete your account, we will delete or anonymise your personal data within 30 days, except where required to retain it for legal or regulatory purposes.`,
  },
  {
    id: '07',
    title: 'Location Data',
    icon: '📍',
    content: `Location access is optional and requested only to show nearby attractions and bus routes. You can revoke location permission at any time in your device settings. Denying location access reduces functionality but you can still use the App.`,
  },
  {
    id: '08',
    title: "Children's Privacy",
    icon: '👶',
    content: `Tourkokan is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, contact us and we will delete it promptly.`,
  },
  {
    id: '09',
    title: 'Cookies & Analytics',
    icon: '🍪',
    content: `Our website uses cookies for authentication and anonymised analytics. You may disable cookies through browser settings, though this may affect Website functionality. We use anonymised data only to understand how users interact with our services.`,
  },
  {
    id: '10',
    title: 'Changes to This Policy',
    icon: '📝',
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes by updating the "Last Updated" date and via in-app notification. Continued use of the App after changes constitutes acceptance.`,
  },
]

const sectionsMr = [
  {
    id: '01',
    title: 'आम्ही काय गोळा करतो',
    icon: '📋',
    items: [
      'खाते माहिती — नाव, ईमेल पत्ता, मोबाइल नंबर',
      'प्रोफाइल डेटा — ऐच्छिक फोटो, प्रवास प्राधान्ये, जतन केलेली स्थळे',
      'स्थान डेटा — GPS (तुमच्या परवानगीने) जवळची आकर्षणे दाखवण्यासाठी',
      'डिव्हाइस माहिती — डिव्हाइसचा प्रकार, OS आवृत्ती, IP पत्ता',
      'वापर डेटा — पाहिलेली पृष्ठे, वापरलेल्या सुविधा, शोध प्रश्न',
      'वापरकर्ता सामग्री — तुम्ही सादर केलेली पुनरावलोकने, फोटो, टिप्पण्या',
      'समर्थन संप्रेषण — तुम्ही आमच्या टीमला पाठवलेले संदेश',
    ],
  },
  {
    id: '02',
    title: 'आम्ही तुमच्या डेटाचा उपयोग कसा करतो',
    icon: '🔧',
    items: [
      'अ‍ॅप आणि त्याच्या सुविधा प्रदान करणे, चालवणे आणि सुधारणे',
      'तुमचा अनुभव वैयक्तिकृत करणे आणि संबंधित स्थळे सुचवणे',
      'सेवा-संबंधित सूचना पाठवणे आणि प्रश्नांना उत्तर देणे',
      'फसवणूक, दुरुपयोग आणि सुरक्षा घटना शोधणे आणि प्रतिबंधित करणे',
      'सेवा सुधारण्यासाठी अनामिक वापर ट्रेंडचे विश्लेषण करणे',
      'कायदेशीर जबाबदाऱ्यांचे पालन करणे',
    ],
  },
  {
    id: '03',
    title: 'डेटा सुरक्षा',
    icon: '🔒',
    content: `आम्ही AES-256 एन्क्रिप्शन, TLS/HTTPS ट्रान्समिशन आणि कठोर प्रवेश नियंत्रणांसह उद्योग-मानक सुरक्षा उपाय अंमलात आणतो. असे असले तरी, कोणतीही इलेक्ट्रॉनिक प्रणाली १००% सुरक्षित नसते. मजबूत पासवर्ड वापरण्याची शिफारस आम्ही करतो. अनधिकृत प्रवेशाची शंका असल्यास support@Tourkokan.com वर तत्काळ संपर्क करा.`,
  },
  {
    id: '04',
    title: 'तुमची माहिती सामायिक करणे',
    icon: '🤝',
    content: `आम्ही तुमची वैयक्तिक माहिती विकत नाही. खालील प्रकरणांमध्ये डेटा सामायिक केला जाऊ शकतो: (अ) सेवा प्रदाते — क्लाउड होस्टिंग, विश्लेषण आणि पेमेंट प्रोसेसर जे डेटा सुरक्षितपणे हाताळण्यास करारबद्ध आहेत; (ब) कायदेशीर आवश्यकता — कायदा, न्यायालयाचा आदेश किंवा सुरक्षिततेचे रक्षण करण्यासाठी; (क) व्यवसाय हस्तांतरण — विलीनीकरण किंवा अधिग्रहणात सहभागी असल्यास.`,
  },
  {
    id: '05',
    title: 'तुमचे अधिकार',
    icon: '⚖️',
    items: [
      'आम्ही तुमच्याबद्दल ठेवलेली वैयक्तिक माहिती पाहण्याचा अधिकार',
      'अचूक नसलेली किंवा अपूर्ण माहिती दुरुस्त करण्याचा अधिकार',
      'तुमचे खाते आणि डेटा हटवण्याची विनंती (/delete-account वर जा)',
      'कधीही डिव्हाइस सेटिंग्जद्वारे स्थान किंवा मार्केटिंग संमती मागे घेण्याचा अधिकार',
      'डेटा संरक्षण प्राधिकरणाकडे तक्रार दाखल करण्याचा अधिकार',
    ],
  },
  {
    id: '06',
    title: 'डेटा ठेवण्याची मुदत',
    icon: '🗃️',
    content: `तुमचे खाते सक्रिय असेपर्यंत आम्ही तुमचा डेटा ठेवतो. खाते हटवल्यास, कायदेशीर किंवा नियामक कारणांसाठी आवश्यक असलेल्या डेटाचा अपवाद वगळता, आम्ही ३० दिवसांच्या आत तुमचा वैयक्तिक डेटा हटवू किंवा अनामिक करू.`,
  },
  {
    id: '07',
    title: 'स्थान डेटा',
    icon: '📍',
    content: `स्थान प्रवेश ऐच्छिक आहे आणि केवळ जवळची आकर्षणे आणि बस मार्ग दाखवण्यासाठी मागितला जातो. तुम्ही कधीही डिव्हाइस सेटिंग्जमध्ये स्थान परवानगी रद्द करू शकता. स्थान प्रवेश नाकारल्यास काही सुविधा कमी होतात, परंतु तुम्ही अ‍ॅप वापरणे सुरू ठेवू शकता.`,
  },
  {
    id: '08',
    title: 'मुलांची गोपनीयता',
    icon: '👶',
    content: `Tourkokan १३ वर्षाखालील मुलांसाठी नाही. आम्ही जाणीवपूर्वक १३ वर्षाखालील मुलांकडून वैयक्तिक माहिती गोळा करत नाही. असे झाल्याचे तुम्हाला वाटत असल्यास आम्हाला संपर्क करा; आम्ही ती माहिती तत्काळ हटवू.`,
  },
  {
    id: '09',
    title: 'कुकीज आणि विश्लेषण',
    icon: '🍪',
    content: `आमची वेबसाइट प्रमाणीकरण आणि अनामिक विश्लेषणासाठी कुकीज वापरते. तुम्ही ब्राउझर सेटिंग्जद्वारे कुकीज अक्षम करू शकता, परंतु यामुळे वेबसाइटच्या काही सुविधांवर परिणाम होऊ शकतो. आम्ही वापरकर्ते आमच्या सेवांशी कसे संवाद साधतात हे समजून घेण्यासाठी केवळ अनामिक डेटा वापरतो.`,
  },
  {
    id: '10',
    title: 'या धोरणातील बदल',
    icon: '📝',
    content: `आम्ही हे गोपनीयता धोरण वेळोवेळी अद्यतनित करू शकतो. महत्त्वपूर्ण बदलांची सूचना "शेवटचे अद्यतन" तारीख बदलून आणि अ‍ॅप-अंतर्गत सूचनेद्वारे दिली जाईल. बदलानंतर अ‍ॅप सुरू ठेवणे म्हणजे स्वीकृती होय.`,
  },
]

const content = {
  en: {
    title: 'Privacy Policy',
    subtitle: 'Last updated: April 2025 · Applies to the Tourkokan app and website',
    intro: `Tourkokan is committed to protecting your privacy. This policy explains exactly what data we collect, why we collect it, and how you can control it. We do not sell your personal information — ever. Questions? Email`,
    sections: sectionsEn,
    deleteTitle: 'Want to delete your account?',
    deleteDesc: 'You can permanently delete your account and all associated data at any time.',
    deleteBtn: 'Delete Account',
    footerText: 'Also read our',
    footerLink: 'Terms & Conditions',
    footerLinkDesc: 'for full usage rules.',
    contactBtn: 'Contact Us',
  },
  mr: {
    title: 'गोपनीयता धोरण',
    subtitle: 'शेवटचे अद्यतन: एप्रिल २०२५ · Tourkokan अ‍ॅप आणि वेबसाइटसाठी लागू',
    intro: `Tourkokan तुमच्या गोपनीयतेचे संरक्षण करण्यास वचनबद्ध आहे. हे धोरण आम्ही नेमकी कोणती माहिती गोळा करतो, का करतो आणि तुम्ही ती कशी नियंत्रित करू शकता हे स्पष्ट करते. आम्ही तुमची वैयक्तिक माहिती कधीही विकत नाही. प्रश्न असल्यास, ईमेल करा`,
    sections: sectionsMr,
    deleteTitle: 'तुमचे खाते हटवायचे आहे का?',
    deleteDesc: 'तुम्ही कधीही तुमचे खाते आणि सर्व संबंधित डेटा कायमस्वरूपी हटवू शकता.',
    deleteBtn: 'खाते हटवा',
    footerText: 'आमच्या',
    footerLink: 'अटी आणि शर्ती',
    footerLinkDesc: 'देखील वाचा.',
    contactBtn: 'संपर्क करा',
  },
}

const PrivacyPage = () => {
  const { lang } = useLang()
  const c = lang === 'mr' ? content.mr : content.en
  const sections = c.sections

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl dark:text-white">{c.title}</h1>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400">{c.subtitle}</p>
        </div>

        {/* Intro card */}
        <div className="mb-10 rounded-2xl border border-primary-100 bg-primary-50 p-6 dark:border-primary-900/40 dark:bg-primary-900/20">
          <p className="text-sm leading-relaxed text-primary-800 dark:text-primary-300">
            {c.intro}{' '}
            <a href="mailto:support@Tourkokan.com" className="font-semibold underline">
              support@Tourkokan.com
            </a>
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-neutral-100 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{section.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">{section.id}</span>
                    <h2 className="font-semibold text-neutral-900 dark:text-white">{section.title}</h2>
                  </div>
                  {'items' in section && section.items ? (
                    <ul className="mt-3 space-y-1.5">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {'content' in section ? section.content : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete account CTA */}
        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300">{c.deleteTitle}</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">{c.deleteDesc}</p>
            </div>
            <Link
              href="/delete-account"
              className="shrink-0 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:bg-transparent dark:text-red-400"
            >
              {c.deleteBtn}
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:text-left">
          <div className="flex-1 text-sm text-neutral-600 dark:text-neutral-400">
            {c.footerText}{' '}
            <Link href="/terms" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              {c.footerLink}
            </Link>{' '}
            {c.footerLinkDesc}
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {c.contactBtn}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
