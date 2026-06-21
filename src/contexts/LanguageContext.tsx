import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getLang, setLang } from '../lib/store'

const ar = {
  nav_home: 'الرئيسية',
  nav_about: 'من نحن',
  nav_services: 'خدماتنا',
  nav_markets: 'الأسواق',
  nav_news: 'الأخبار',
  nav_faq: 'الأسئلة الشائعة',
  nav_contact: 'تواصل معنا',
  login_btn: 'بوابة العملاء',
  logout_btn: 'تسجيل الخروج',
  lang_toggle: '🌐 AR | EN',
  lang_current: 'ar',
  my_portfolio: 'محفظتي الاستثمارية',
  my_profile: 'ملفي الشخصي',
  portfolio_short: 'محفظتي',
  hero_badge: 'شركة استثمارية مرخصة • منذ 2010',
  hero_sub: 'بأيدي خبراء',
  hero_line3: 'نحو مستقبل مالي أكثر ثباتاً',
  hero_desc: 'ندير استثماراتك في أسواق الأسهم العربية والعالمية، العملات الرقمية، المعادن النفيسة والنفط، بخبرة احترافية تمتد لأكثر من خمسة عشر عاماً.',
  hero_btn1: 'تواصل مع مستشار',
  hero_btn2: 'اكتشف خدماتنا',
  hero_badge1: 'ترخيص رسمي',
  hero_badge2: 'استشارة مجانية',
  hero_badge3: '+$2B أصول مُدارة',
  footer_privacy: 'سياسة الخصوصية',
  footer_terms: 'الشروط والأحكام',
  footer_disclosures: 'الإفصاحات',
  footer_copyright: 'الثروة كابيتال. جميع الحقوق محفوظة.',
  privacy_title: 'سياسة الخصوصية',
  privacy_close: 'إغلاق',
  privacy_empty: 'سياسة الخصوصية غير متاحة حالياً. يرجى التواصل مع الشركة للمزيد من المعلومات.',
  contact_advisor: 'تواصل مع مستشار',
  menu: 'القائمة',
} as const

const en = {
  nav_home: 'Home',
  nav_about: 'About Us',
  nav_services: 'Services',
  nav_markets: 'Markets',
  nav_news: 'News',
  nav_faq: 'FAQ',
  nav_contact: 'Contact Us',
  login_btn: 'Client Portal',
  logout_btn: 'Sign Out',
  lang_toggle: '🌐 EN | AR',
  lang_current: 'en',
  my_portfolio: 'My Portfolio',
  my_profile: 'My Profile',
  portfolio_short: 'Portfolio',
  hero_badge: 'Licensed Investment Firm • Since 2010',
  hero_sub: 'In expert hands',
  hero_line3: 'Towards a more stable financial future',
  hero_desc: 'We manage your investments in Arab and global equity markets, cryptocurrencies, precious metals and oil, with professional expertise spanning over fifteen years.',
  hero_btn1: 'Contact an Advisor',
  hero_btn2: 'Explore Our Services',
  hero_badge1: 'Official License',
  hero_badge2: 'Free Consultation',
  hero_badge3: '+$2B Assets Managed',
  footer_privacy: 'Privacy Policy',
  footer_terms: 'Terms & Conditions',
  footer_disclosures: 'Disclosures',
  footer_copyright: 'Tharwah Capital. All rights reserved.',
  privacy_title: 'Privacy Policy',
  privacy_close: 'Close',
  privacy_empty: 'Privacy policy is not available at this time. Please contact us for more information.',
  contact_advisor: 'Contact Advisor',
  menu: 'Menu',
} as const

type TranslationKey = keyof typeof ar
type Translations = typeof ar

interface LangCtx {
  lang: 'ar' | 'en'
  t: (key: TranslationKey) => string
  toggleLang: () => void
}

const translations: Record<'ar' | 'en', Translations> = { ar, en }

const LangContext = createContext<LangCtx>({
  lang: 'ar',
  t: (k) => ar[k],
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<'ar' | 'en'>(getLang())

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  const toggleLang = () => {
    const next: 'ar' | 'en' = lang === 'ar' ? 'en' : 'ar'
    setLangState(next)
    setLang(next)
  }

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.ar[key]

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
