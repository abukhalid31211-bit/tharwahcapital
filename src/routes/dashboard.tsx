import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BarChart3, Settings, LogOut,
  FileText, MessageSquare, Landmark,
  Copy, Check, Eye, EyeOff, Home,
  Phone, Mail, Shield,
} from "lucide-react";
import {
  getMyProfile, getMyPortfolio, getMyTransactions,
  submitContactMessage,
  type ClientProfile, type Portfolio, type ClientTransaction
} from "../lib/api";
import { clearClientSession, getClientSession } from "../lib/auth";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

// ─── Types ────────────────────────────────────────────────────────────────────
type FV = { value: string; visible: boolean }
type FSSection = Record<string, FV>

interface PortfolioData {
  personal?: FSSection
  financial?: FSSection
  banking?: FSSection
  notes?: FSSection
  investments?: {
    visible?: Record<string, boolean>
    saStocks?: InvestRow[]
    gulfStocks?: InvestRow[]
    globalStocks?: InvestRow[]
    cryptoRows?: CryptoRow[]
    forexRows?: ForexRow[]
    metalRows?: MetalRow[]
    oilRows?: OilRow[]
  }
  sectionNotes?: Record<string, string>
}
interface InvestRow { code?: string; name?: string; qty?: string; price?: string; notes?: string }
interface CryptoRow { symbol?: string; qty?: string; avgPrice?: string }
interface ForexRow  { pair?: string; lots?: string; direction?: string; avgPrice?: string }
interface MetalRow  { metal?: string; weight?: string; unit?: string; avgPrice?: string }
interface OilRow    { type?: string; contracts?: string; avgPrice?: string }

// ─── Constants ────────────────────────────────────────────────────────────────
const font = "'Cairo', sans-serif";

const FIELD_LABELS: Record<string, string> = {
  fullName:'الاسم الكامل', nationality:'الجنسية', idType:'نوع الهوية', idNumber:'رقم الهوية',
  idExpiry:'انتهاء الهوية', phone:'الهاتف', altPhone:'هاتف بديل', email:'البريد الإلكتروني',
  address:'العنوان', city:'المدينة', country:'الدولة', openDate:'تاريخ الفتح',
  portfolioCode:'كود المحفظة', riskLevel:'مستوى المخاطرة', investmentGoal:'هدف الاستثمار',
  investmentHorizon:'أفق الاستثمار', currency:'العملة',
  initialCapital:'رأس المال الابتدائي', monthlyAddition:'الإضافة الشهرية',
  annualIncome:'الدخل السنوي', netWorth:'صافي الثروة',
  otherInvestments:'استثمارات أخرى', monthlyExpenses:'المصروفات الشهرية',
  liquidReserve:'الاحتياطي السائل', riskTolerance:'تحمّل المخاطر',
  maxLoss:'أقصى خسارة', previousExp:'خبرة سابقة',
  taxResident:'المقيم الضريبي', usCitizen:'مواطن أمريكي',
  bankName:'البنك', iban:'رقم IBAN', accountName:'اسم صاحب الحساب',
  branch:'الفرع', swiftCode:'رمز SWIFT', transferMethod:'طريقة التحويل',
  secondBankName:'البنك الثانوي', secondIBAN:'IBAN الثانوي', secondAccountName:'الحساب الثانوي',
  internalNotes:'ملاحظات', specialConditions:'شروط خاصة',
}

const COL_LABELS: Record<string, string> = {
  code:'الرمز', name:'الاسم', qty:'الكمية', price:'السعر', notes:'ملاحظة',
  symbol:'العملة', avgPrice:'متوسط السعر', pair:'الزوج', lots:'اللوتات',
  direction:'الاتجاه', metal:'المعدن', weight:'الوزن', unit:'الوحدة',
  type:'النوع', contracts:'العقود',
}

const TX_COLORS: Record<string, string> = {
  buy:'#00D97E', sell:'#FF4560', transfer:'#3B82F6', deposit:'#0EA5E9', withdraw:'#F59E0B',
}
const TX_LABELS: Record<string, string> = {
  buy:'شراء', sell:'بيع', transfer:'تحويل', deposit:'إيداع', withdraw:'سحب',
}
const TIER_COLORS: Record<string, string> = {
  'عادي':'#64748B', Silver:'#94A3B8', Gold:'#F59E0B', Platinum:'#6366F1',
  VIP:'#0EA5E9', 'VIP+':'#3B82F6', Private:'#8B5CF6', Elite:'#FF4560',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString('ar-SA') } catch { return d }
}
function getVisibleFields(section: FSSection | undefined): { label: string; value: string }[] {
  if (!section) return []
  return Object.entries(section)
    .filter(([, fv]) => fv?.visible && fv?.value)
    .map(([k, fv]) => ({ label: FIELD_LABELS[k] || k, value: fv.value }))
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function SH({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <span style={{ fontSize:'1.1rem' }}>{icon}</span>
      <span style={{ fontSize:'0.95rem', fontWeight:800, color:'#1E293B' }}>{title}</span>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, padding:'12px 14px' }}>
      <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#94A3B8', marginBottom:5, textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:'0.875rem', fontWeight:600, color:'#1E293B', wordBreak:'break-all' }}>{value}</div>
    </div>
  )
}

function InfoList({ items }: { items: { label: string; value: string }[] }) {
  if (!items.length) return (
    <div style={{ textAlign:'center', color:'#94A3B8', fontSize:'0.82rem', padding:'16px 0' }}>لا توجد بيانات محددة لعرضها.</div>
  )
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {items.map(it => <InfoCard key={it.label} label={it.label} value={it.value} />)}
    </div>
  )
}

function SectionNote({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div style={{ marginTop:14, background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10, padding:'12px 14px' }}>
      <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#F59E0B', marginBottom:4 }}>📝 ملاحظة</div>
      <div style={{ fontSize:'0.82rem', color:'#475569', lineHeight:1.8 }}>{text}</div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 16px', background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, color:'#94A3B8', fontSize:'0.875rem' }}>
      {text}
    </div>
  )
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { id:'info',         icon:Home,          label:'الرئيسية' },
  { id:'investments',  icon:BarChart3,      label:'الاستثمارات' },
  { id:'banking',      icon:Landmark,       label:'البنوك' },
  { id:'transactions', icon:FileText,       label:'المعاملات' },
  { id:'support',      icon:MessageSquare,  label:'التواصل' },
  { id:'settings',     icon:Settings,       label:'الإعدادات' },
]

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')

  const [profile,      setProfile]      = useState<ClientProfile | null>(null)
  const [portfolio,    setPortfolio]     = useState<Portfolio | null>(null)
  const [transactions, setTransactions]  = useState<ClientTransaction[]>([])
  const [loading,      setLoading]       = useState(true)
  const [error,        setError]         = useState('')

  const [ibanVisible,   setIbanVisible]  = useState<Record<string,boolean>>({})
  const [copied,        setCopied]       = useState<string|null>(null)
  const [supportMsg,    setSupportMsg]   = useState('')
  const [supportSent,   setSupportSent]  = useState(false)
  const [supportLoading,setSupportLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('client_token')
    if (!token) { navigate({ to:'/login' }); return }
    const session = getClientSession()
    if (!session) localStorage.removeItem('tharwah_client_auth')
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true); setError('')
    const tid = setTimeout(() => {
      setLoading(false)
      setError('انتهت مهلة الاتصال. تحقق من اتصالك بالإنترنت وحاول مجدداً.')
    }, 12000)
    try {
      const [pfRes, ptRes, txRes] = await Promise.all([
        getMyProfile(), getMyPortfolio(), getMyTransactions(20),
      ])
      clearTimeout(tid)
      setProfile(pfRes.client)
      setPortfolio(ptRes.portfolio)
      setTransactions(txRes.transactions || [])
      if (!getClientSession() && pfRes.client)
        localStorage.setItem('tharwah_client_auth', JSON.stringify(pfRes.client))
    } catch (e: unknown) {
      clearTimeout(tid)
      const msg = e instanceof Error ? e.message : 'فشل تحميل البيانات'
      if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('missing token')) {
        clearClientSession(); navigate({ to:'/login' }); return
      }
      setError(msg)
    } finally {
      clearTimeout(tid)
      setLoading(false)
    }
  }

  const handleLogout = () => { clearClientSession(); navigate({ to:'/login' }) }
  const handleCopy   = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key); setTimeout(() => setCopied(null), 2000)
    })
  }
  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supportMsg.trim() || !profile) return
    setSupportLoading(true)
    try {
      await submitContactMessage({ name:profile.name, email:profile.email||'', message:supportMsg, source:'client-dashboard' })
      setSupportSent(true); setSupportMsg('')
    } catch { /* ignore */ }
    finally { setSupportLoading(false) }
  }

  // ── Derived data ────────────────────────────────────────────────────────────
  const pd           = portfolio?.portfolio_data as PortfolioData | undefined
  const sectionNotes = pd?.sectionNotes || {}
  const personalFields  = getVisibleFields(pd?.personal)
  const financialFields = getVisibleFields(pd?.financial)
  const bankingFields   = getVisibleFields(pd?.banking)
  const noteFields      = getVisibleFields(pd?.notes)
  const investData      = pd?.investments
  const investVis       = investData?.visible || {}

  const investSections = [
    { key:'sa',     label:'🇸🇦 أسهم سعودية',  titleKey:'name',   rows:investData?.saStocks?.filter(r=>r.code||r.name||r.qty),                                       cols:['code','name','qty','price','notes'] as const },
    { key:'gulf',   label:'🌍 أسهم خليجية',    titleKey:'name',   rows:investData?.gulfStocks?.filter(r=>r.code||r.name||r.qty),                                     cols:['code','name','qty','price','notes'] as const },
    { key:'global', label:'🌐 أسهم عالمية',    titleKey:'name',   rows:investData?.globalStocks?.filter(r=>r.code||r.name||r.qty),                                   cols:['code','name','qty','price','notes'] as const },
    { key:'crypto', label:'₿ عملات رقمية',     titleKey:'symbol', rows:(investData?.cryptoRows as unknown as InvestRow[])?.filter(r=>(r as unknown as CryptoRow).symbol), cols:['symbol','qty','avgPrice'] as const },
    { key:'forex',  label:'💱 فوركس',           titleKey:'pair',   rows:(investData?.forexRows  as unknown as InvestRow[])?.filter(r=>(r as unknown as ForexRow).pair),   cols:['pair','lots','direction','avgPrice'] as const },
    { key:'metals', label:'💎 معادن',            titleKey:'metal',  rows:(investData?.metalRows  as unknown as InvestRow[])?.filter(r=>(r as unknown as MetalRow).metal),  cols:['metal','weight','unit','avgPrice'] as const },
    { key:'oil',    label:'⛽ نفط',              titleKey:'type',   rows:(investData?.oilRows    as unknown as InvestRow[])?.filter(r=>(r as unknown as OilRow).type),      cols:['type','contracts','avgPrice'] as const },
  ].filter(s => investVis[s.key] !== false && s.rows && s.rows.length > 0)

  const membershipLabel = profile?.membership_level || 'عادي'
  const tierColor       = TIER_COLORS[membershipLabel] || '#0EA5E9'
  const pageTitle       = NAV.find(n => n.id === activeTab)?.label || ''

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F4F8', fontFamily:font }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, borderRadius:'50%', border:'4px solid #E2E8F0', borderTopColor:'#0EA5E9', margin:'0 auto 16px', animation:'spin 1s linear infinite' }}/>
        <div style={{ color:'#64748B', fontSize:'0.9rem' }}>جارٍ تحميل بياناتك...</div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F4F8', fontFamily:font, padding:24 }}>
      <div style={{ textAlign:'center', width:'100%', maxWidth:360 }}>
        <div style={{ fontSize:'2.8rem', marginBottom:12 }}>⚠️</div>
        <div style={{ fontSize:'1rem', fontWeight:700, color:'#1E293B', marginBottom:8 }}>خطأ في تحميل البيانات</div>
        <div style={{ fontSize:'0.85rem', color:'#64748B', marginBottom:24, lineHeight:1.7 }}>{error}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={loadData} style={{ padding:'12px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:font, fontSize:'0.875rem' }}>إعادة المحاولة</button>
          <button onClick={()=>{ clearClientSession(); navigate({ to:'/login' }) }} style={{ padding:'12px', background:'transparent', border:'1px solid #CBD5E0', borderRadius:10, color:'#475569', fontWeight:700, cursor:'pointer', fontFamily:font, fontSize:'0.875rem' }}>تسجيل الدخول مجدداً</button>
        </div>
      </div>
    </div>
  )

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#F0F4F8', fontFamily:font, direction:'rtl' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}
      `}</style>

      {/* ── Fixed Header ─────────────────────────────────────────────── */}
      <header style={{
        position:'fixed', top:0, right:0, left:0, height:60,
        background:'#FFFFFF', borderBottom:'1px solid #E2E8F0',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 16px', zIndex:100,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#0EA5E9,#0284C7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>⚡</div>
          <div>
            <div style={{ fontSize:'0.62rem', color:'#94A3B8', lineHeight:1, marginBottom:2 }}>ثروة كابيتال</div>
            <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B', lineHeight:1.2 }}>{pageTitle}</div>
          </div>
        </div>
        <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${tierColor},${tierColor}99)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.9rem', flexShrink:0, border:`2px solid ${tierColor}44` }}>
          {(profile?.name||'؟').charAt(0)}
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main style={{ paddingTop:60, paddingBottom:84, paddingRight:16, paddingLeft:16 }}>

        {/* ══ الرئيسية ══════════════════════════════════════════════ */}
        {activeTab === 'info' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:16 }}>

            {/* Hero */}
            <div style={{ background:'linear-gradient(135deg,#0EA5E9,#0284C7)', borderRadius:16, padding:'22px 18px', color:'#fff', position:'relative', overflow:'hidden', textAlign:'center' }}>
              <div style={{ position:'absolute', right:-30, top:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
              <div style={{ position:'absolute', left:-20, bottom:-40, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
              <div style={{ position:'relative' }}>
                <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(255,255,255,0.22)', border:'2px solid rgba(255,255,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', fontWeight:800, margin:'0 auto 10px' }}>
                  {(profile?.name||'؟').charAt(0)}
                </div>
                <div style={{ fontSize:'1.15rem', fontWeight:800, marginBottom:8 }}>{profile?.name}</div>
                <span style={{ display:'inline-block', padding:'4px 18px', borderRadius:20, background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', fontSize:'0.78rem', fontWeight:700, marginBottom:10 }}>
                  {membershipLabel}
                </span>
                {profile?.email && <div style={{ fontSize:'0.78rem', opacity:0.85, marginBottom:3 }}>{profile.email}</div>}
                {profile?.phone && <div style={{ fontSize:'0.78rem', opacity:0.8, marginBottom:3 }}>{profile.phone}</div>}
                {profile?.join_date && <div style={{ fontSize:'0.7rem', opacity:0.65, marginTop:4 }}>عضو منذ {fmtDate(profile.join_date)}</div>}
              </div>
            </div>

            {/* Quick cards — 2 cols */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { emoji:'🔢', label:'رقم الحساب',       value:profile?.account_number||'—' },
                { emoji:'💼', label:'كود المحفظة',      value:profile?.portfolio_code||'—' },
                { emoji:'💰', label:'الاستثمار الأولي', value:profile?.initial_investment||'—' },
                { emoji:'📋', label:'الحالة',           value:profile?.status==='active'?'✅ نشط':profile?.status==='pending'?'⏳ قيد المراجعة':'❌ موقوف' },
              ].map(s => (
                <div key={s.label} style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:12, padding:'14px 12px' }}>
                  <div style={{ fontSize:'1.3rem', marginBottom:8 }}>{s.emoji}</div>
                  <div style={{ fontSize:'0.65rem', color:'#94A3B8', fontWeight:700, marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#1E293B', wordBreak:'break-all' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Personal */}
            {personalFields.length > 0 && (
              <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, padding:16 }}>
                <SH icon="👤" title="البيانات الشخصية"/>
                <InfoList items={personalFields}/>
                <SectionNote text={sectionNotes.personal}/>
              </div>
            )}

            {/* Financial */}
            {financialFields.length > 0 && (
              <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, padding:16 }}>
                <SH icon="💰" title="الوضع المالي"/>
                <InfoList items={financialFields}/>
                <SectionNote text={sectionNotes.financial}/>
              </div>
            )}

            {/* Notes */}
            {noteFields.length > 0 && (
              <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, padding:16 }}>
                <SH icon="📝" title="ملاحظات"/>
                <InfoList items={noteFields}/>
              </div>
            )}

            {!portfolio && (
              <EmptyState text="لا توجد بيانات محفظة مسجلة بعد. تواصل مع الإدارة لإعداد محفظتك." />
            )}
          </div>
        )}

        {/* ══ الاستثمارات ══════════════════════════════════════════ */}
        {activeTab === 'investments' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:16 }}>
            <div style={{ fontSize:'0.8rem', color:'#64748B' }}>محفظتك الاستثمارية كما حددها الفريق</div>

            {investSections.length === 0
              ? <EmptyState text="لا توجد استثمارات مُضافة حتى الآن." />
              : investSections.map(sec => (
                <div key={sec.key} style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, overflow:'hidden' }}>
                  {/* Section header */}
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B' }}>{sec.label}</span>
                    <span style={{ fontSize:'0.68rem', color:'#94A3B8', background:'#F8FAFC', padding:'3px 10px', borderRadius:20, border:'1px solid #E2E8F0' }}>
                      {sec.rows?.length} عنصر
                    </span>
                  </div>
                  {/* Asset rows as cards */}
                  {(sec.rows || []).map((row, i) => {
                    const r = row as Record<string, string>
                    const titleVal = r[sec.titleKey] || `#${i + 1}`
                    const detailCols = sec.cols.filter(c => c !== sec.titleKey && r[c])
                    return (
                      <div key={i} style={{ padding:'14px 16px', borderBottom:i < (sec.rows?.length||0)-1?'1px solid #F1F5F9':'none' }}>
                        <div style={{ fontSize:'0.9rem', fontWeight:700, color:'#1E293B', marginBottom:8 }}>{titleVal}</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 18px' }}>
                          {detailCols.map(c => (
                            <div key={c} style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                              <span style={{ fontSize:'0.68rem', color:'#94A3B8', fontWeight:600 }}>{COL_LABELS[c]||c}:</span>
                              <span style={{ fontSize:'0.8rem', color:'#475569', fontFamily:'monospace' }}>{r[c]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))
            }
            <SectionNote text={sectionNotes.investments}/>
          </div>
        )}

        {/* ══ البنوك ════════════════════════════════════════════════ */}
        {activeTab === 'banking' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:16 }}>
            <div style={{ fontSize:'0.8rem', color:'#64748B' }}>حساباتك البنكية المسجلة</div>

            {bankingFields.length === 0
              ? <EmptyState text="لا توجد بيانات بنكية مسجلة حتى الآن." />
              : bankingFields.map((item, i) => {
                  const isIBAN = item.label.includes('IBAN') || item.label.includes('آيبان')
                  const key    = `iban_${i}`
                  const show   = ibanVisible[key]
                  return (
                    <div key={i} style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:12, padding:'14px 16px' }}>
                      <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#94A3B8', marginBottom:6 }}>{item.label}</div>
                      <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#1E293B', fontFamily:isIBAN?'monospace':font, letterSpacing:isIBAN?'0.03em':undefined, marginBottom:12, wordBreak:'break-all' }}>
                        {isIBAN && !show ? item.value.replace(/[A-Z0-9]/g,'•') : item.value}
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {isIBAN && (
                          <button onClick={() => setIbanVisible(v=>({...v,[key]:!v[key]}))}
                            style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, cursor:'pointer', color:'#475569', fontSize:'0.75rem', fontFamily:font, fontWeight:600 }}>
                            {show ? <><EyeOff size={12}/> إخفاء</> : <><Eye size={12}/> عرض</>}
                          </button>
                        )}
                        <button onClick={() => handleCopy(item.value, key)}
                          style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:copied===key?'rgba(0,217,126,0.08)':'rgba(14,165,233,0.08)', border:`1px solid ${copied===key?'rgba(0,217,126,0.25)':'rgba(14,165,233,0.2)'}`, borderRadius:8, cursor:'pointer', color:copied===key?'#00D97E':'#0EA5E9', fontSize:'0.75rem', fontFamily:font, fontWeight:600 }}>
                          {copied===key ? <><Check size={12}/> تم النسخ</> : <><Copy size={12}/> نسخ</>}
                        </button>
                      </div>
                    </div>
                  )
                })
            }
            {bankingFields.length > 0 && <SectionNote text={sectionNotes.banking}/>}
          </div>
        )}

        {/* ══ المعاملات ════════════════════════════════════════════ */}
        {activeTab === 'transactions' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:16 }}>
            <div style={{ fontSize:'0.8rem', color:'#64748B' }}>{transactions.length} معاملة مسجلة</div>

            {transactions.length === 0
              ? <EmptyState text="لا توجد معاملات مسجلة حتى الآن." />
              : transactions.map(tx => (
                <div key={tx.id} style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:12, padding:'14px 16px' }}>
                  {/* Type + Status */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ padding:'4px 14px', borderRadius:20, fontSize:'0.75rem', fontWeight:700, background:`${TX_COLORS[tx.type]||'#64748B'}18`, color:TX_COLORS[tx.type]||'#64748B', border:`1px solid ${TX_COLORS[tx.type]||'#64748B'}33` }}>
                      {TX_LABELS[tx.type]||tx.type}
                    </span>
                    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:600, background:tx.status==='completed'?'rgba(0,217,126,0.08)':tx.status==='pending'?'rgba(245,158,11,0.08)':'rgba(255,69,96,0.08)', color:tx.status==='completed'?'#00D97E':tx.status==='pending'?'#F59E0B':'#FF4560', border:`1px solid ${tx.status==='completed'?'rgba(0,217,126,0.25)':tx.status==='pending'?'rgba(245,158,11,0.25)':'rgba(255,69,96,0.25)'}` }}>
                      {tx.status==='completed'?'مكتمل':tx.status==='pending'?'معلق':'مرفوض'}
                    </span>
                  </div>
                  {/* Amount */}
                  <div style={{ fontSize:'1.15rem', fontWeight:800, color:'#0EA5E9', fontFamily:'monospace', marginBottom:8 }}>
                    {tx.amount?.toLocaleString()||'—'} <span style={{ fontSize:'0.78rem', fontWeight:600, color:'#64748B', fontFamily:font }}>{tx.currency||''}</span>
                  </div>
                  {/* Reference + Date */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:'0.7rem', color:'#94A3B8', fontFamily:'monospace' }}>{tx.reference||'—'}</span>
                    <span style={{ fontSize:'0.72rem', color:'#64748B' }}>{fmtDate(tx.created_at)}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ══ التواصل ════════════════════════════════════════════════ */}
        {activeTab === 'support' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:16 }}>
            <div style={{ fontSize:'0.8rem', color:'#64748B' }}>أرسل رسالتك وسيتم الرد عليك في أقرب وقت</div>

            {/* Form card */}
            <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, padding:18 }}>
              {supportSent ? (
                <div style={{ textAlign:'center', padding:'28px 0' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✅</div>
                  <div style={{ fontSize:'0.95rem', fontWeight:700, color:'#1E293B', marginBottom:6 }}>تم إرسال رسالتك بنجاح</div>
                  <div style={{ fontSize:'0.82rem', color:'#64748B', marginBottom:20 }}>سيتواصل معك فريقنا قريباً.</div>
                  <button onClick={() => setSupportSent(false)} style={{ padding:'10px 24px', background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:8, color:'#0EA5E9', fontWeight:700, cursor:'pointer', fontFamily:font, fontSize:'0.875rem' }}>
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSupport} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#475569', marginBottom:6 }}>الاسم</label>
                    <input readOnly value={profile?.name||''} style={{ width:'100%', padding:'11px 14px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, fontSize:'0.875rem', fontFamily:font, color:'#94A3B8', outline:'none' }}/>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#475569', marginBottom:6 }}>البريد الإلكتروني</label>
                    <input readOnly value={profile?.email||''} style={{ width:'100%', padding:'11px 14px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, fontSize:'0.875rem', fontFamily:font, color:'#94A3B8', outline:'none' }}/>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#475569', marginBottom:6 }}>الرسالة *</label>
                    <textarea value={supportMsg} onChange={e=>setSupportMsg(e.target.value)} rows={5} required placeholder="اكتب رسالتك هنا..."
                      style={{ width:'100%', padding:'11px 14px', background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:10, fontSize:'0.875rem', fontFamily:font, color:'#1E293B', outline:'none', resize:'vertical', lineHeight:1.7 }}/>
                  </div>
                  <button type="submit" disabled={supportLoading}
                    style={{ padding:'13px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, cursor:supportLoading?'not-allowed':'pointer', fontFamily:font, fontSize:'0.875rem', opacity:supportLoading?0.7:1 }}>
                    {supportLoading ? '⏳ جارٍ الإرسال...' : 'إرسال الرسالة'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, padding:16 }}>
              <SH icon="📞" title="بيانات التواصل"/>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { icon:<Mail size={14}/>,   label:'البريد الإلكتروني', value:'info@tharwahcapital.com' },
                  { icon:<Phone size={14}/>,  label:'الهاتف',            value:'+966 11 000 1234' },
                  { icon:<Shield size={14}/>, label:'ساعات العمل',       value:'الأحد – الخميس / 9 ص – 5 م' },
                ].map(row => (
                  <div key={row.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#F8FAFC', borderRadius:10, border:'1px solid #F1F5F9' }}>
                    <span style={{ color:'#0EA5E9', flexShrink:0 }}>{row.icon}</span>
                    <div>
                      <div style={{ fontSize:'0.68rem', color:'#94A3B8', fontWeight:600, marginBottom:2 }}>{row.label}</div>
                      <div style={{ fontSize:'0.82rem', color:'#1E293B', fontWeight:600 }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ الإعدادات ════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:16 }}>
            <div style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:16, overflow:'hidden' }}>
              {[
                { label:'الاسم الكامل',      value:profile?.name||'—' },
                { label:'البريد الإلكتروني', value:profile?.email||'—' },
                { label:'رقم الهاتف',        value:profile?.phone||'—' },
                { label:'رقم الحساب',        value:profile?.account_number||'—' },
                { label:'كود المحفظة',       value:profile?.portfolio_code||'—' },
                { label:'مستوى العضوية',    value:membershipLabel },
                { label:'الحالة',            value:profile?.status==='active'?'نشط':profile?.status==='pending'?'قيد المراجعة':'موقوف' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', borderBottom:i<arr.length-1?'1px solid #F8FAFC':'none' }}>
                  <span style={{ fontSize:'0.8rem', color:'#64748B' }}>{row.label}</span>
                  <span style={{ fontSize:'0.875rem', color:'#1E293B', fontWeight:700, textAlign:'left', maxWidth:'55%', wordBreak:'break-all' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background:'#FFF5F5', border:'1px solid rgba(255,69,96,0.15)', borderRadius:16, padding:16 }}>
              <div style={{ fontSize:'0.8rem', color:'#64748B', marginBottom:14, lineHeight:1.7 }}>
                لتغيير كلمة المرور أو بياناتك الشخصية، يرجى التواصل مع الإدارة.
              </div>
              <button onClick={handleLogout}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px', background:'rgba(255,69,96,0.08)', border:'1px solid rgba(255,69,96,0.2)', borderRadius:10, cursor:'pointer', color:'#FF4560', fontWeight:700, fontFamily:font, fontSize:'0.875rem' }}>
                <LogOut size={15}/> تسجيل الخروج
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ── Fixed Bottom Navigation ───────────────────────────────── */}
      <nav style={{
        position:'fixed', bottom:0, right:0, left:0, height:68,
        background:'#FFFFFF', borderTop:'1px solid #E2E8F0',
        display:'flex', justifyContent:'space-around', alignItems:'center',
        zIndex:100,
      }}>
        {NAV.map(item => {
          const active = activeTab === item.id
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, flex:1, height:'100%', background:'none', border:'none', cursor:'pointer', color:active?'#0EA5E9':'#94A3B8', transition:'color .15s', padding:'6px 2px', position:'relative', fontFamily:font }}>
              {active && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:28, height:2, background:'#0EA5E9', borderRadius:'0 0 3px 3px' }}/>}
              <item.icon size={active?22:20} strokeWidth={active?2.5:1.8}/>
              <span style={{ fontSize:'0.6rem', fontWeight:active?700:500, whiteSpace:'nowrap' }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}
