'use client'

import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'

const sectionsEn = [
  {
    id: '01',
    title: 'Acceptance of Terms',
    content: `By downloading, installing, or using the Tourkokan application or visiting Tourkokan.com, you agree to be bound by these Terms. If you do not agree, please do not use our services.`,
  },
  {
    id: '02',
    title: 'Description of Service',
    content: `Tourkokan provides a travel-guide platform for the Konkan coast of Maharashtra, India. Features include destination guides, live bus routes, local food recommendations, accommodation listings, and user-submitted reviews. The App is available on Android; iOS is coming soon.`,
  },
  {
    id: '03',
    title: 'User Accounts',
    content: `You may use parts of the App as a guest. Creating an account requires a valid name and either an email address or mobile number. You are responsible for maintaining the confidentiality of your credentials. Notify us immediately at support@Tourkokan.com if you suspect unauthorised access.`,
  },
  {
    id: '04',
    title: 'User-Generated Content',
    content: `By submitting reviews, photos, or other content, you grant Tourkokan a non-exclusive, royalty-free, worldwide licence to use, reproduce, and display that content in connection with our services. You represent that you have the rights to submit such content and that it does not violate any third-party rights or applicable law.`,
  },
  {
    id: '05',
    title: 'Prohibited Conduct',
    content: `You agree not to: post false, misleading, or harmful content; impersonate any person or entity; use the App for commercial solicitation without written consent; attempt to reverse-engineer or scrape our services; or upload malware or engage in activity that disrupts the App.`,
  },
  {
    id: '06',
    title: 'Intellectual Property',
    content: `All content, branding, and technology within the App and Website are owned by or licensed to Tourkokan. The Tourkokan name, logo, and trade dress are trademarks of Tourkokan. Nothing herein grants you any right to use our intellectual property without prior written permission.`,
  },
  {
    id: '07',
    title: 'Disclaimers',
    content: `The App is provided "as is" without warranties of any kind. Travel information, bus schedules, and listings are sourced from third parties and may not always be accurate. Always verify critical information before travel. Tourkokan is not liable for any loss, injury, or inconvenience arising from reliance on App information.`,
  },
  {
    id: '08',
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, Tourkokan shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount you paid (if any) for the App in the three months preceding the claim.`,
  },
  {
    id: '09',
    title: 'Account Deletion',
    content: `You may delete your account at any time from the app settings or by visiting Tourkokan.com/delete-account. Deletion permanently removes all personal data associated with your account within 30 days, except where we are required to retain it by law.`,
  },
  {
    id: '10',
    title: 'Changes to Terms',
    content: `We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the revised Terms. We will notify you of significant changes via an in-app notification or email.`,
  },
  {
    id: '11',
    title: 'Governing Law',
    content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.`,
  },
]

const sectionsMr = [
  {
    id: '01',
    title: 'अटींची स्वीकृती',
    content: `Tourkokan अ‍ॅप डाउनलोड करून, इन्स्टॉल करून किंवा वापरून अथवा Tourkokan.com ला भेट देऊन, तुम्ही या अटींना बांधील राहण्यास सहमती देता. असहमत असल्यास, कृपया आमच्या सेवा वापरू नका.`,
  },
  {
    id: '02',
    title: 'सेवेचे वर्णन',
    content: `Tourkokan हे भारताच्या महाराष्ट्रातील कोकण किनारपट्टीसाठी प्रवास-मार्गदर्शन व्यासपीठ आहे. यात स्थळ मार्गदर्शिका, बस मार्ग, स्थानिक खाद्य शिफारसी, निवास सूची आणि वापरकर्त्यांनी सादर केलेली पुनरावलोकने यांचा समावेश आहे. हे अ‍ॅप Android वर उपलब्ध आहे; iOS लवकरच येणार आहे.`,
  },
  {
    id: '03',
    title: 'वापरकर्ता खाती',
    content: `तुम्ही अ‍ॅपचे काही भाग अतिथी म्हणून वापरू शकता. खाते तयार करण्यासाठी वैध नाव आणि ईमेल पत्ता किंवा मोबाइल नंबर आवश्यक आहे. तुमच्या क्रेडेन्शियल्सची गोपनीयता राखण्याची जबाबदारी तुमची आहे. अनधिकृत प्रवेशाची शंका असल्यास support@Tourkokan.com वर तत्काळ कळवा.`,
  },
  {
    id: '04',
    title: 'वापरकर्त्याने तयार केलेली सामग्री',
    content: `पुनरावलोकने, फोटो किंवा इतर सामग्री सादर करून, तुम्ही Tourkokan ला ती सामग्री आमच्या सेवांच्या संदर्भात वापरण्याचा, पुनरुत्पादित करण्याचा आणि प्रदर्शित करण्याचा गैर-अनन्य, रॉयल्टी-मुक्त, जागतिक परवाना देता. तुम्ही हमी देता की तुम्हाला ती सामग्री सादर करण्याचे अधिकार आहेत आणि ती कोणत्याही तृतीय-पक्षाच्या अधिकारांचे किंवा लागू कायद्याचे उल्लंघन करत नाही.`,
  },
  {
    id: '05',
    title: 'प्रतिबंधित आचरण',
    content: `तुम्ही खालील गोष्टी न करण्यास सहमती देता: खोटी, दिशाभूल करणारी किंवा हानिकारक सामग्री पोस्ट करणे; कोणत्याही व्यक्ती किंवा संस्थेची तोतयागिरी करणे; लिखित संमतीशिवाय व्यावसायिक विनंतीसाठी अ‍ॅप वापरणे; आमच्या सेवा रिव्हर्स-इंजिनिअर किंवा स्क्रेप करण्याचा प्रयत्न करणे; किंवा मालवेअर अपलोड करणे किंवा अ‍ॅपमध्ये व्यत्यय आणणाऱ्या क्रियाकलापांमध्ये भाग घेणे.`,
  },
  {
    id: '06',
    title: 'बौद्धिक संपदा',
    content: `अ‍ॅप आणि वेबसाइटमधील सर्व सामग्री, ब्रँडिंग आणि तंत्रज्ञान Tourkokan च्या मालकीचे आहे किंवा त्याला परवानाकृत आहे. Tourkokan नाव, लोगो आणि ट्रेड ड्रेस Tourkokan चे ट्रेडमार्क आहेत. यातील कोणतीही बाब तुम्हाला पूर्वलेखी परवानगीशिवाय आमच्या बौद्धिक संपदा वापरण्याचा अधिकार देत नाही.`,
  },
  {
    id: '07',
    title: 'अस्वीकरण',
    content: `अ‍ॅप कोणत्याही हमीशिवाय "जसे आहे तसे" प्रदान केले जाते. प्रवास माहिती, बस वेळापत्रक आणि सूची तृतीय पक्षांकडून मिळवली जाते आणि ती नेहमी अचूक नसू शकते. प्रवासापूर्वी महत्त्वाची माहिती नेहमी पडताळून घ्या. अ‍ॅप माहितीवर अवलंबून राहिल्यामुळे होणाऱ्या कोणत्याही नुकसानासाठी, दुखापतीसाठी किंवा गैरसोयीसाठी Tourkokan जबाबदार नाही.`,
  },
  {
    id: '08',
    title: 'दायित्व मर्यादा',
    content: `कायद्याने परवानगी असलेल्या कमाल मर्यादेपर्यंत, Tourkokan कोणत्याही अप्रत्यक्ष, आनुषंगिक, विशेष किंवा परिणामकारक नुकसानासाठी जबाबदार नाही. आमची एकूण जबाबदारी दाव्याच्या आधीच्या तीन महिन्यांत तुम्ही अ‍ॅपसाठी दिलेल्या रकमेपेक्षा जास्त असणार नाही.`,
  },
  {
    id: '09',
    title: 'खाते हटवणे',
    content: `तुम्ही कधीही अ‍ॅप सेटिंग्जमधून किंवा Tourkokan.com/delete-account ला भेट देऊन तुमचे खाते हटवू शकता. हटवल्याने कायद्याने ठेवणे आवश्यक असलेल्या डेटाचा अपवाद वगळता, ३० दिवसांच्या आत तुमच्या खात्याशी संबंधित सर्व वैयक्तिक डेटा कायमस्वरूपी काढला जातो.`,
  },
  {
    id: '10',
    title: 'अटींमधील बदल',
    content: `आम्ही वेळोवेळी या अटी अद्यतनित करू शकतो. बदलानंतर अ‍ॅप सुरू ठेवणे म्हणजे सुधारित अटींची स्वीकृती होय. अ‍ॅप-अंतर्गत सूचना किंवा ईमेलद्वारे महत्त्वपूर्ण बदलांची सूचना दिली जाईल.`,
  },
  {
    id: '11',
    title: 'लागू कायदा',
    content: `या अटी भारताच्या कायद्यांद्वारे नियंत्रित आहेत. कोणत्याही विवादांवर महाराष्ट्र, भारतातील न्यायालयांचे विशेष अधिकारक्षेत्र असेल.`,
  },
]

const content = {
  en: {
    title: 'Terms & Conditions',
    subtitle: 'Last updated: April 2025 · Effective for all Tourkokan users',
    intro: `These Terms & Conditions govern your use of the Tourkokan app and website. By using our services you agree to these terms. Questions? Email us at`,
    sections: sectionsEn,
    footerText: 'Also read our',
    footerLink: 'Privacy Policy',
    footerLinkDesc: '— it explains how we collect and protect your data.',
    contactBtn: 'Contact Us',
  },
  mr: {
    title: 'अटी आणि शर्ती',
    subtitle: 'शेवटचे अद्यतन: एप्रिल २०२५ · सर्व Tourkokan वापरकर्त्यांसाठी लागू',
    intro: `हे अटी आणि शर्ती Tourkokan अ‍ॅप आणि वेबसाइटच्या वापराचे नियमन करतात. आमच्या सेवा वापरून तुम्ही या अटींना सहमती देता. प्रश्न असल्यास ईमेल करा`,
    sections: sectionsMr,
    footerText: 'आमचे',
    footerLink: 'गोपनीयता धोरण',
    footerLinkDesc: 'देखील वाचा — आम्ही तुमचा डेटा कसा गोळा करतो आणि संरक्षित करतो हे त्यात सांगितले आहे.',
    contactBtn: 'संपर्क करा',
  },
}

const TermsPage = () => {
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
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {section.id}
                </span>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:text-left">
          <div className="flex-1 text-sm text-neutral-600 dark:text-neutral-400">
            {c.footerText}{' '}
            <Link href="/privacy" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
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

export default TermsPage
