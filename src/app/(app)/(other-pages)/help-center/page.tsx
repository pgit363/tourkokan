'use client'

import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is Tourkokan?',
        a: 'Tourkokan is your guide to exploring the Konkan coast of Maharashtra. We list beaches, forts, waterfalls, temples, and local events to help travellers discover hidden gems along the coast.',
      },
      {
        q: 'Do I need an account to browse destinations?',
        a: 'You can browse the home page freely. To explore destinations, events, gallery, and bus routes in detail, you need a quick guest account — it takes just one tap and no password is required.',
      },
      {
        q: 'Is Tourkokan free to use?',
        a: 'Yes, Tourkokan is completely free for travellers. You can explore all destinations, events, and routes without any charges.',
      },
    ],
  },
  {
    category: 'Guest Account',
    items: [
      {
        q: 'What is a guest account?',
        a: 'A guest account is a temporary session we create for you automatically. It lets you access all features — saving places, viewing details, and more — without signing up with an email.',
      },
      {
        q: 'How long does a guest session last?',
        a: 'Guest sessions are valid for 24 hours from the time you sign in. After that you can simply create a new guest session.',
      },
      {
        q: 'Can I upgrade from a guest account to a full account?',
        a: 'Full account registration with email is available on the Tourkokan mobile app. Download it from Google Play to get a permanent account with more features.',
      },
    ],
  },
  {
    category: 'Destinations & Places',
    items: [
      {
        q: 'How do I find a specific beach or fort?',
        a: 'Go to Destinations and use the search bar to type the name. You can also filter by category (Beach, Fort, Waterfall, Temple, etc.) to narrow down results.',
      },
      {
        q: 'How do I save a place for later?',
        a: 'Tap the heart icon on any destination card to save it. You can view all saved places in your account under "Saved Places".',
      },
      {
        q: 'Can I add a place that is not listed?',
        a: 'Yes! Use our "Add a Place" form to suggest a new destination. Our team reviews all submissions before publishing them.',
      },
    ],
  },
  {
    category: 'Bus Routes',
    items: [
      {
        q: 'How do I find a bus route between two places?',
        a: 'Go to Bus Routes, select your departure point in the "From" field and your destination in the "To" field, then tap Search.',
      },
      {
        q: 'Are the bus timings accurate?',
        a: 'We try to keep timings updated but schedules can change. We recommend confirming at the local ST bus stand for the most current information.',
      },
    ],
  },
  {
    category: 'Events',
    items: [
      {
        q: 'How do I find upcoming festivals in Kokan?',
        a: 'Open the Events page and use the search or filters. You can filter by "Featured" to see the biggest upcoming events, or search by festival name or location.',
      },
      {
        q: 'How can I submit an event?',
        a: 'Event submissions are currently handled through the Tourkokan mobile app or by contacting us directly via the Contact page.',
      },
    ],
  },
  {
    category: 'Advertising',
    items: [
      {
        q: 'How can I advertise my business on Tourkokan?',
        a: 'Visit our Advertise page to see available packages and pricing. Fill out the enquiry form and our team will get back to you within 24 hours.',
      },
      {
        q: 'What types of businesses can advertise?',
        a: 'Hotels, homestays, restaurants, boat tours, water sports operators, local experiences, and any business serving Konkan travellers can advertise on Tourkokan.',
      },
    ],
  },
]

const mrFaqs = [
  {
    category: 'सुरुवात करूया',
    items: [
      {
        q: 'Tourkokan म्हणजे काय?',
        a: 'Tourkokan हे महाराष्ट्राच्या कोकण किनारपट्टीची सफर घडवून आणणारे तुमचे हक्काचे गाईड आहे. इथले अथांग किनारे, ऐतिहासिक किल्ले, मनमोहक धबधबे, प्राचीन मंदिरे आणि स्थानिक उत्सवांची इत्थंभूत माहिती देऊन कोकणचे दडलेले सौंदर्य उलगडण्यास आम्ही मदत करतो.',
      },
      {
        q: 'माहिती पाहण्यासाठी खाते (Account) असणे आवश्यक आहे का?',
        a: 'Tourkokan चे मुख्यपृष्ठ पाहण्यासाठी कोणत्याही खात्याची गरज नाही. पण इथली ठिकाणे, कार्यक्रम, चित्रदालन आणि एसटीचे वेळापत्रक सविस्तर पाहण्यासाठी तुम्हाला मोफत "गेस्ट अकाउंट" लागेल — हे फक्त एका क्लिकवर बनते आणि यासाठी कोणत्याही पासवर्डची गरज नाही.',
      },
      {
        q: 'Tourkokan वापरण्यासाठी पैसे लागतात का?',
        a: 'होय, Tourkokan पर्यटकांसाठी अगदी मोफत आहे! इथली सर्व माहिती, ठिकाणे आणि मार्ग तुम्ही कोणत्याही शुल्काशिवाय पाहू शकता.',
      },
    ],
  },
  {
    category: 'गेस्ट अकाउंट (Guest Account)',
    items: [
      {
        q: 'गेस्ट अकाउंट म्हणजे काय?',
        a: 'गेस्ट अकाउंट हे तुमच्यासाठी आपोआप तयार झालेले एक तात्पुरते खाते आहे. यामुळे तुम्हाला ईमेल आयडी न देताही माहिती पाहता येते आणि तुमची आवडती ठिकाणे जतन (Save) करता येतात.',
      },
      {
        q: 'गेस्ट अकाउंट किती वेळ चालते?',
        a: 'गेस्ट अकाउंट तुम्ही साइन इन केल्यापासून फक्त २४ तासांसाठी वैध असते. त्यानंतर तुम्ही एका क्लिकवर सहज नवीन गेस्ट अकाउंट बनवू शकता.',
      },
      {
        q: 'गेस्ट अकाउंटवरून कायमस्वरूपी खाते बनवता येते का?',
        a: 'होय! पण कायमस्वरूपी खाते बनवण्यासाठी तुम्हाला आमचे Tourkokan अ‍ॅप डाउनलोड करावे लागेल. Google Play वरून अ‍ॅप डाउनलोड करा आणि ईमेलद्वारे नोंदणी करून सर्व सुविधांचा लाभ घ्या.',
      },
    ],
  },
  {
    category: 'ठिकाणे आणि पर्यटन स्थळे',
    items: [
      {
        q: 'एखादा विशिष्ट किनारा किंवा किल्ला कसा शोधायचा?',
        a: '"ठिकाणे" (Destinations) विभागात जाऊन सर्च बारमध्ये तुम्हाला हवे असलेले नाव टाईप करा. तुम्ही समुद्रकिनारा, किल्ला किंवा धबधबा अशा श्रेणी (Categories) निवडूनही शोध घेऊ शकता.',
      },
      {
        q: 'आवडलेली ठिकाणे जतन (Save) कशी करायची?',
        a: 'कोणत्याही ठिकाणाच्या माहितीवर असलेल्या "हार्ट" (Heart) आयकॉनवर क्लिक करा. तुमची सर्व आवडती ठिकाणे "माझे खाते" मधील "जतन केलेली ठिकाणे" या विभागात सेव्ह होतील.',
      },
      {
        q: 'अ‍ॅपवर नसलेले एखादे नवीन ठिकाण मी सुचवू शकतो का?',
        a: 'नक्कीच! तुम्ही "नवीन ठिकाण जोडा" या पर्यायावर जाऊन नवीन स्थळाची माहिती देऊ शकता. आमची टीम माहिती तपासून ते ठिकाण अ‍ॅपवर प्रकाशित करेल.',
      },
    ],
  },
  {
    category: 'एसटी वेळापत्रक आणि मार्ग',
    items: [
      {
        q: 'दोन ठिकाणांमधील बस मार्ग कसा शोधायचा?',
        a: 'आमच्या "बस मार्ग" विभागात जा. तिथे "येथून" (From) आणि "येथे" (To) मध्ये तुमची ठिकाणे निवडा आणि शोधा बटणावर क्लिक करा.',
      },
      {
        q: 'येथील एसटीचे वेळापत्रक अचूक असते का?',
        a: 'आम्ही वेळापत्रक शक्य तितके अचूक ठेवण्याचा प्रयत्न करतो. तरीही, एसटीच्या वेळा बदलू शकतात, त्यामुळे प्रवासाला निघण्यापूर्वी स्थानिक एसटी स्टँडवर वेळेची खात्री करून घेणे केव्हाही उत्तम.',
      },
    ],
  },
  {
    category: 'सण, उत्सव आणि कार्यक्रम',
    items: [
      {
        q: 'कोकणातील आगामी सण कसे शोधायचे?',
        a: '"कार्यक्रम" पानावर जाऊन तुम्ही आगामी सण आणि जत्रा शोधू शकता. कोकणातील सर्वात मोठ्या उत्सवांसाठी "खास आकर्षण" (Featured) हा फिल्टर वापरा किंवा नाव आणि ठिकाणानुसार शोध घ्या.',
      },
      {
        q: 'एखाद्या स्थानिक कार्यक्रमाची माहिती अ‍ॅपवर कशी द्यायची?',
        a: 'सध्या तुम्ही Tourkokan अ‍ॅपवरून किंवा आमच्या "संपर्क करा" पानावरून आम्हाला मेसेज पाठवून कोणत्याही कार्यक्रमाची माहिती देऊ शकता.',
      },
    ],
  },
  {
    category: 'जाहिरात',
    items: [
      {
        q: 'Tourkokan वर माझ्या व्यवसायाची जाहिरात कशी करायची?',
        a: 'जाहिरातींचे दर आणि पॅकेजेस पाहण्यासाठी आमच्या "जाहिरात करा" पानावर जा. तिथे असलेला फॉर्म भरून पाठवा, आमची टीम २४ तासांत तुमच्याशी संपर्क साधेल.',
      },
      {
        q: 'कोणत्या प्रकारचे व्यवसाय जाहिरात करू शकतात?',
        a: 'हॉटेल्स, होमस्टे, रेस्टॉरंट्स, खानावळी, बोटिंग आणि वॉटर स्पोर्ट्स यांसारखे कोकणात पर्यटकांना सेवा देणारे कोणतेही व्यवसाय आमच्यासोबत जाहिरात करू शकतात.',
      },
    ],
  },
]

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-neutral-100 last:border-0 dark:border-neutral-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="pr-4 text-sm font-medium text-neutral-900 dark:text-white">{q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{a}</p>
      )}
    </div>
  )
}

export default function HelpCenterPage() {
  const { t, lang } = useLang()
  const [activeIndex, setActiveIndex] = useState(0)

  const faqData = lang === 'mr' ? mrFaqs : faqs
  const current = faqData[activeIndex]

  return (
    <div className="container py-16 lg:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{t.helpCenter.pageTitle}</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          {t.helpCenter.pageSubtitle}
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {faqData.map((section, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeIndex === i
                  ? 'bg-primary-600 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {section.category}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        {current && (
          <div className="rounded-2xl border border-neutral-100 bg-white px-6 dark:border-neutral-700 dark:bg-neutral-800">
            {current.items.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-10 rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
          <h2 className="font-semibold text-neutral-900 dark:text-white">{t.helpCenter.contactTitle}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {t.helpCenter.contactSubtext}
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            {t.helpCenter.contactButton}
          </Link>
        </div>
      </div>
    </div>
  )
}
