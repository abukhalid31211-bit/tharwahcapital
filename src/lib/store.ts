export const KEYS = {
  lang: 'tharwah_lang',
  privacyPolicy: 'tharwah_privacy_policy',
  clientsOverride: 'tharwah_live_clients',
  transactionsOverride: 'tharwah_live_transactions',
  portfoliosOverride: 'tharwah_live_portfolios',
  clientAuth: 'tharwah_client_auth',
  adminAnnouncements: 'tharwah_admin_announcements',
  siteName: 'tharwah_site_name',
  siteNameEn: 'tharwah_site_name_en',
  contactMessages: 'tharwah_contact_messages',
}

const SITE_NAME_CHANGED = 'tharwah_site_name_changed'

export function getSiteName(): string {
  return localStorage.getItem(KEYS.siteName) || 'ثروة كابيتال'
}
export function setSiteName(name: string) {
  localStorage.setItem(KEYS.siteName, name)
  window.dispatchEvent(new Event(SITE_NAME_CHANGED))
}
export function getSiteNameEn(): string {
  return localStorage.getItem(KEYS.siteNameEn) || 'Tharwah Capital'
}
export function setSiteNameEn(name: string) {
  localStorage.setItem(KEYS.siteNameEn, name)
  window.dispatchEvent(new Event(SITE_NAME_CHANGED))
}
export { SITE_NAME_CHANGED }

export function getLang(): 'ar' | 'en' {
  return (localStorage.getItem(KEYS.lang) as 'ar' | 'en') || 'ar'
}
export function setLang(lang: 'ar' | 'en') {
  localStorage.setItem(KEYS.lang, lang)
}

export function getPrivacyPolicy(): string {
  return localStorage.getItem(KEYS.privacyPolicy) || ''
}
export function setPrivacyPolicy(text: string) {
  localStorage.setItem(KEYS.privacyPolicy, text)
}

export function getLiveClients<T>(): T[] {
  try {
    const raw = localStorage.getItem(KEYS.clientsOverride)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function setLiveClients<T>(clients: T[]) {
  localStorage.setItem(KEYS.clientsOverride, JSON.stringify(clients))
}

export function getLiveTransactions<T>(): T[] {
  try {
    const raw = localStorage.getItem(KEYS.transactionsOverride)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function setLiveTransactions<T>(txs: T[]) {
  localStorage.setItem(KEYS.transactionsOverride, JSON.stringify(txs))
}

export function getLivePortfolios<T>(): T[] {
  try {
    const raw = localStorage.getItem(KEYS.portfoliosOverride)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function setLivePortfolios<T>(portfolios: T[]) {
  localStorage.setItem(KEYS.portfoliosOverride, JSON.stringify(portfolios))
}

export function getAnnouncements(): { id: number; text: string; date: string; clientId?: number }[] {
  try {
    const raw = localStorage.getItem(KEYS.adminAnnouncements)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
export function addAnnouncement(text: string, clientId?: number) {
  const current = getAnnouncements()
  const entry = { id: Date.now(), text, date: new Date().toLocaleDateString('ar-SA'), clientId }
  localStorage.setItem(KEYS.adminAnnouncements, JSON.stringify([entry, ...current].slice(0, 50)))
}

// ==================== Contact Messages ====================

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  service: string
  message: string
  date: string
  status: 'new' | 'read' | 'replied'
  source: 'contact' | 'support'
}

export function getContactMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(KEYS.contactMessages)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addContactMessage(msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) {
  const current = getContactMessages()
  const entry: ContactMessage = {
    ...msg,
    id: Date.now(),
    date: new Date().toLocaleString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    status: 'new',
  }
  localStorage.setItem(KEYS.contactMessages, JSON.stringify([entry, ...current].slice(0, 200)))
  window.dispatchEvent(new Event('tharwah_contact_messages_changed'))
}

export function updateContactMessageStatus(id: number, status: ContactMessage['status']) {
  const msgs = getContactMessages()
  const updated = msgs.map(m => m.id === id ? { ...m, status } : m)
  localStorage.setItem(KEYS.contactMessages, JSON.stringify(updated))
  window.dispatchEvent(new Event('tharwah_contact_messages_changed'))
}

export function deleteContactMessage(id: number) {
  const msgs = getContactMessages()
  const updated = msgs.filter(m => m.id !== id)
  localStorage.setItem(KEYS.contactMessages, JSON.stringify(updated))
  window.dispatchEvent(new Event('tharwah_contact_messages_changed'))
}
