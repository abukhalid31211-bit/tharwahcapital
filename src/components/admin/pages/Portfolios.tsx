import { useState } from 'react'
import { mockPortfolios, mockClients, STOCKS_SA_LIST, STOCKS_GLOBAL_LIST, CRYPTO_LIST, FOREX_PAIRS_LIST, METALS_LIST, OIL_TYPES_LIST, BANKS_SA_LIST } from '../adminData'
import { Plus, Trash2, ChevronDown, ChevronUp, Check, Upload, Eye, EyeOff } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
type FV = { value: string; visible: boolean }
type FS = Record<string, FV>
interface StockRow  { code:string; name:string; qty:string; price:string; notes:string }
interface CryptoRow { symbol:string; qty:string; avgPrice:string }
interface ForexRow  { pair:string; lots:string; direction:string; avgPrice:string }
interface MetalRow  { metal:string; weight:string; unit:string; avgPrice:string }
interface OilRow    { type:string; contracts:string; avgPrice:string }

// ═══════════════════════════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════════════════════════
const C = {
  input:   { width:'100%', padding:'9px 12px', background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:8, color:'#1E293B', fontSize:'0.82rem', outline:'none', fontFamily:"'Cairo',sans-serif", boxSizing:'border-box' as const },
  label:   { display:'block', fontSize:'0.72rem', fontWeight:700, color:'#475569', marginBottom:5 } as React.CSSProperties,
  section: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12 } as React.CSSProperties,
  sectionHeader: { padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', userSelect:'none' as const },
  visRow:  { display:'flex', alignItems:'center', gap:12, marginTop:8, paddingTop:8, borderTop:'1px dashed #E2E8F0' } as React.CSSProperties,
  visBtn:  (active: boolean) => ({
    display:'flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:20, fontSize:'0.7rem', fontWeight:700, cursor:'pointer', fontFamily:"'Cairo',sans-serif", border:'none', transition:'all .15s',
    background: active ? 'rgba(16,185,129,0.12)' : '#F1F5F9',
    color: active ? '#059669' : '#94A3B8',
  } as React.CSSProperties),
  fieldBox: { background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:10, padding:'12px 14px' } as React.CSSProperties,
}

// ═══════════════════════════════════════════════════════════════
// HELPERS — unified field state factory
// ═══════════════════════════════════════════════════════════════
const fv = (value = '', visible = true): FV => ({ value, visible })
const makeFS = (defaults: Record<string, string>): FS =>
  Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, fv(v)]))
const makeUpdater =
  (setter: React.Dispatch<React.SetStateAction<FS>>) =>
  (key: string, patch: Partial<FV>) =>
    setter(s => ({ ...s, [key]: { ...s[key], ...patch } }))
const makeRowUpdater =
  <T extends Record<string,string>>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
  (i: number, k: keyof T, v: string) =>
    setter(rows => rows.map((r, idx) => idx === i ? { ...r, [k]: v } : r))
const makeRowRemover =
  <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
  (i: number) =>
    setter(rows => rows.filter((_, idx) => idx !== i))
const assetColors: Record<string,string> = { stocks:'#3B82F6', crypto:'#F59E0B', metals:'#9CA3AF', oil:'#EF4444' }

// ═══════════════════════════════════════════════════════════════
// COMPONENT — VisibilityToggle
// ═══════════════════════════════════════════════════════════════
function VisibilityToggle({ visible, onChange }: { visible: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={C.visRow}>
      <span style={{ fontSize:'0.68rem', color:'#94A3B8', fontWeight:600 }}>ظهور للعميل:</span>
      <button type="button" style={C.visBtn(visible)} onClick={() => onChange(true)}>
        <Eye size={11}/> إظهار
      </button>
      <button type="button" style={C.visBtn(!visible)} onClick={() => onChange(false)}>
        <EyeOff size={11}/> إخفاء
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT — HybridSelect (قائمة + إدخال حر)
// ═══════════════════════════════════════════════════════════════
function HybridSelect({ options, value, onChange, placeholder = 'أو اكتب قيمة مخصصة...' }: {
  options: string[]; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const isCustom = value !== '' && !options.includes(value)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <select
        value={isCustom ? '__custom__' : value}
        onChange={e => { if (e.target.value !== '__custom__') onChange(e.target.value) }}
        style={{ ...C.input, cursor:'pointer' }}
      >
        <option value="">اختر...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
        <option value="__custom__">✏️ قيمة مخصصة</option>
      </select>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...C.input, fontSize:'0.78rem', color:'#64748B', borderStyle: isCustom ? 'solid' : 'dashed', borderColor: isCustom ? '#0EA5E9' : '#CBD5E1' }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT — FlexField (حقل مرن مع زر ظهور/إخفاء)
// ═══════════════════════════════════════════════════════════════
function FlexField({ label, fkey, state, onUpdate, options, type = 'text', placeholder = '', mono = false }: {
  label: string; fkey: string; state: FS; onUpdate: (key:string, patch:Partial<FV>) => void;
  options?: string[]; type?: string; placeholder?: string; mono?: boolean
}) {
  const { value, visible } = state[fkey] ?? fv()
  const inputStyle = { ...C.input, ...(mono ? { fontFamily:'monospace' } : {}) }
  return (
    <div style={C.fieldBox}>
      <label style={C.label}>{label}</label>
      {options ? (
        <HybridSelect options={options} value={value} onChange={v => onUpdate(fkey, { value: v })} />
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={e => onUpdate(fkey, { value: e.target.value })}
          placeholder={placeholder} rows={3}
          style={{ ...inputStyle, resize:'vertical', lineHeight:1.7 }}/>
      ) : (
        <input type={type} value={value} onChange={e => onUpdate(fkey, { value: e.target.value })}
          placeholder={placeholder} style={inputStyle}/>
      )}
      <VisibilityToggle visible={visible} onChange={v => onUpdate(fkey, { visible: v })} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT — SectionCard (accordion)
// ═══════════════════════════════════════════════════════════════
function SectionCard({ title, icon, open, onToggle, children }: {
  title:string; icon:string; open:boolean; onToggle:()=>void; children:React.ReactNode
}) {
  return (
    <div style={C.section}>
      <div style={C.sectionHeader} onClick={onToggle}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:'1.1rem' }}>{icon}</span>
          <span style={{ fontSize:'0.88rem', fontWeight:700, color:'#1E293B' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} color="#64748B"/> : <ChevronDown size={16} color="#64748B"/>}
      </div>
      {open && <div style={{ padding:'0 18px 18px', borderTop:'1px solid #E2E8F0', paddingTop:16 }}>{children}</div>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT — InvestmentTable (جدول أصول مع HybridSelect)
// ═══════════════════════════════════════════════════════════════
function InvestmentTable<T extends Record<string,string>>({ rows, onAdd, onRemove, onChange, columns, sectionLabel, sectionVisible, onSectionVisibleChange }: {
  rows: T[]; onAdd: ()=>void; onRemove: (i:number)=>void;
  onChange: (i:number, k:keyof T, v:string)=>void;
  columns: { key:keyof T; label:string; type?:'select'|'text'; options?:string[] }[];
  sectionLabel: string; sectionVisible: boolean; onSectionVisibleChange: (v:boolean)=>void
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {/* Section-level visibility */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:'#F1F5F9', borderRadius:8 }}>
        <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#475569' }}>{sectionLabel}</span>
        <div style={{ display:'flex', gap:8 }}>
          <button type="button" style={C.visBtn(sectionVisible)} onClick={() => onSectionVisibleChange(true)}>
            <Eye size={11}/> إظهار القسم للعميل
          </button>
          <button type="button" style={C.visBtn(!sectionVisible)} onClick={() => onSectionVisibleChange(false)}>
            <EyeOff size={11}/> إخفاء
          </button>
        </div>
      </div>

      {rows.length > 0 && (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {columns.map(c => (
                  <th key={String(c.key)} style={{ padding:'8px 10px', textAlign:'right', fontSize:'0.68rem', fontWeight:700, color:'#64748B', background:'#F1F5F9', borderBottom:'1px solid #E2E8F0', whiteSpace:'nowrap' }}>{c.label}</th>
                ))}
                <th style={{ padding:'8px 10px', background:'#F1F5F9', borderBottom:'1px solid #E2E8F0', width:36 }}/>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom:'1px solid rgba(203,213,225,0.5)' }}>
                  {columns.map(col => (
                    <td key={String(col.key)} style={{ padding:'6px 8px' }}>
                      {col.type === 'select' && col.options ? (
                        <HybridSelect
                          options={col.options}
                          value={row[col.key]}
                          onChange={v => onChange(i, col.key, v)}
                          placeholder="قيمة مخصصة..."
                        />
                      ) : (
                        <input type="text" value={row[col.key]} onChange={e => onChange(i, col.key, e.target.value)}
                          style={{ ...C.input, padding:'6px 8px', minWidth:80 }}/>
                      )}
                    </td>
                  ))}
                  <td style={{ padding:'6px 8px' }}>
                    <button type="button" onClick={() => onRemove(i)}
                      style={{ width:28, height:28, background:'rgba(255,69,96,0.1)', border:'1px solid rgba(255,69,96,0.2)', borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#FF4560', padding:0 }}>
                      <Trash2 size={12}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button type="button" onClick={onAdd}
        style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(14,165,233,0.06)', border:'1px dashed rgba(14,165,233,0.3)', borderRadius:8, color:'#0EA5E9', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontSize:'0.78rem', width:'fit-content' }}>
        <Plus size={13}/> إضافة سطر
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════
export default function Portfolios() {
  // ── List view state ──
  const [mainTab, setMainTab] = useState<'list'|'create'>('list')
  const [viewMode, setViewMode] = useState<'grid'|'table'>('grid')
  const [portfoliosList, setPortfoliosList] = useState([...mockPortfolios])
  const [deletePortfolioId, setDeletePortfolioId] = useState<number|null>(null)
  const [portfolioToast, setPortfolioToast] = useState<string|null>(null)
  const [saved, setSaved] = useState(false)

  const showPToast = (msg: string) => { setPortfolioToast(msg); setTimeout(() => setPortfolioToast(null), 3000) }
  const handleDeletePortfolio = (id: number) => { setPortfoliosList(p => p.filter(x => x.clientId !== id)); setDeletePortfolioId(null); showPToast('🗑️ تم حذف المحفظة بنجاح') }

  const totalAUM = portfoliosList.reduce((s, p) => s + p.total, 0)
  const summaryCards = [
    { label:'إجمالي المحافظ', value:portfoliosList.length.toString(), icon:'📁', color:'#3B82F6' },
    { label:'إجمالي AUM', value:'$' + (totalAUM/1000).toFixed(0)+'K', icon:'💰', color:'#0EA5E9' },
    { label:'متوسط العائد', value:portfoliosList.length ? '+' + (portfoliosList.reduce((s,p)=>s+p.return,0)/portfoliosList.length).toFixed(1)+'%' : '-', icon:'📈', color:'#00D97E' },
    { label:'أعلى أداء', value:[...portfoliosList].sort((a,b)=>b.return-a.return)[0]?.clientName.split(' ')[0]||'', icon:'🏆', color:'#F59E0B' },
  ]

  // ── Accordion sections ──
  const [openSections, setOpenSections] = useState({ personal:true, financial:false, investments:false, banking:false, docs:false, notes:false })
  const toggleSection = (k: keyof typeof openSections) => setOpenSections(s => ({ ...s, [k]: !s[k] }))

  // ── Section 1: Personal — unified FS ──
  const [personalFS, setPersonalFS] = useState<FS>(makeFS({
    clientId:'', portfolioCode:'', advisor:'', openDate:'',
    riskLevel:'متوسط', investmentGoal:'نمو رأس المال',
    investmentHorizon:'5 سنوات', currency:'USD',
    fullName:'', nationality:'سعودي', idType:'هوية وطنية',
    idNumber:'', idExpiry:'', phone:'', altPhone:'',
    email:'', address:'', city:'', country:'السعودية',
  }))
  const updatePersonal = makeUpdater(setPersonalFS)

  // ── Section 2: Financial ──
  const [financialFS, setFinancialFS] = useState<FS>(makeFS({
    initialCapital:'', monthlyAddition:'', annualIncome:'', netWorth:'',
    otherInvestments:'', monthlyExpenses:'', liquidReserve:'',
    riskTolerance:'متوسط', maxLoss:'', previousExp:'نعم',
    taxResident:'السعودية', usCitizen:'لا', fatca:'غير منطبق',
  }))
  const updateFinancial = makeUpdater(setFinancialFS)

  // ── Section 3: Investments rows ──
  const [saStocks, setSaStocks]       = useState<StockRow[]>([])
  const [gulfStocks, setGulfStocks]   = useState<StockRow[]>([])
  const [globalStocks, setGlobalStocks] = useState<StockRow[]>([])
  const [cryptoRows, setCryptoRows]   = useState<CryptoRow[]>([])
  const [forexRows, setForexRows]     = useState<ForexRow[]>([])
  const [metalRows, setMetalRows]     = useState<MetalRow[]>([])
  const [oilRows, setOilRows]         = useState<OilRow[]>([])
  const [investVisible, setInvestVisible] = useState<Record<string,boolean>>({
    sa:true, gulf:true, global:true, crypto:true, forex:true, metals:true, oil:true
  })
  const [investTab, setInvestTab] = useState<'sa'|'gulf'|'global'|'crypto'|'forex'|'metals'|'oil'>('sa')

  // ── Section 4: Banking ──
  const [bankingFS, setBankingFS] = useState<FS>(makeFS({
    bankName:'', iban:'', accountName:'', branch:'', swiftCode:'',
    secondBankName:'', secondIBAN:'', secondAccountName:'',
    transferMethod:'حوالة بنكية', depositFrequency:'شهري',
  }))
  const updateBanking = makeUpdater(setBankingFS)

  // ── Section 5: Docs (checkboxes + KYC) ──
  const [docsFS, setDocsFS] = useState<FS>(makeFS({
    idCopy:'لا', addressProof:'لا', bankStatement:'لا',
    taxForm:'لا', riskForm:'لا', contractSigned:'لا',
    kycStatus:'مكتمل', verificationDate:'', verifiedBy:'',
  }))
  const updateDocs = makeUpdater(setDocsFS)

  // ── Section 6: Admin Notes ──
  const [notesFS, setNotesFS] = useState<FS>(makeFS({
    internalNotes:'', specialConditions:'', feeOverride:'',
    priorityLevel:'عادي', tags:'', followUpDate:'',
  }))
  const updateNotes = makeUpdater(setNotesFS)

  const saOptions      = STOCKS_SA_LIST.map(s => `${s.code} - ${s.name}`)
  const globalOptions  = STOCKS_GLOBAL_LIST.map(s => `${s.code} - ${s.name} (${s.exchange})`)
  const clientOptions  = mockClients.map(c => `${c.id} — ${c.name}`)
  const advisorOptions = ['أحمد العمري', 'خالد محمد', 'سارة الزهراني']

  const investTabs = [
    { key:'sa',      label:'🇸🇦 أسهم سعودية',  count:saStocks.length },
    { key:'gulf',    label:'🌍 أسهم خليجية',   count:gulfStocks.length },
    { key:'global',  label:'🌐 أسهم عالمية',   count:globalStocks.length },
    { key:'crypto',  label:'₿ رقمية',          count:cryptoRows.length },
    { key:'forex',   label:'💱 فوركس',          count:forexRows.length },
    { key:'metals',  label:'💎 معادن',          count:metalRows.length },
    { key:'oil',     label:'⛽ نفط',            count:oilRows.length },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => { setSaved(false); setMainTab('list') }, 2500)
  }

  const gridCols = (n: number) => ({ display:'grid', gridTemplateColumns:`repeat(${n},1fr)`, gap:14 }) as React.CSSProperties

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'#1E293B', margin:0 }}>المحافظ الاستثمارية</h1>
          <p style={{ fontSize:'0.78rem', color:'#64748B', marginTop:3 }}>{portfoliosList.length} محفظة — إجمالي AUM: ${(totalAUM/1000).toFixed(0)}K</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {mainTab === 'list' && ['grid','table'].map(m => (
            <button key={m} onClick={() => setViewMode(m as any)}
              style={{ padding:'7px 14px', background:viewMode===m?'rgba(14,165,233,0.15)':'transparent', border:`1px solid ${viewMode===m?'rgba(14,165,233,0.3)':'#E2E8F0'}`, borderRadius:8, color:viewMode===m?'#0EA5E9':'#64748B', fontSize:'0.78rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>
              {m === 'grid' ? 'بطاقات' : 'جدول'}
            </button>
          ))}
          <button onClick={() => setMainTab(mainTab === 'list' ? 'create' : 'list')}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:mainTab==='create'?'rgba(14,165,233,0.1)':'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:mainTab==='create'?'1px solid rgba(14,165,233,0.3)':'none', borderRadius:8, color:mainTab==='create'?'#0EA5E9':'#FFF', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>
            {mainTab === 'create' ? '← قائمة المحافظ' : <><Plus size={14}/> إنشاء محفظة جديدة</>}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={gridCols(4)}>
        {summaryCards.map((s, i) => (
          <div key={i} style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12, padding:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:'0.68rem', color:'#64748B', fontWeight:600 }}>{s.label}</div>
              <div style={{ fontSize:'1.3rem', fontWeight:800, color:s.color, fontFamily:'monospace' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════
          PORTFOLIO LIST VIEW
      ═══════════════════════════════════════ */}
      {mainTab === 'list' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:20 }}>
            <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B', marginBottom:14 }}>ترتيب الأداء</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[...portfoliosList].sort((a,b)=>b.return-a.return).map((p, i) => (
                <div key={p.clientId} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 14px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:10 }}>
                  <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{i===0?'🥇':i===1?'🥈':'🥉'}</span>
                  <span style={{ fontSize:'0.85rem', fontWeight:600, color:'#1E293B', flex:1 }}>{p.clientName}</span>
                  <span style={{ fontSize:'0.78rem', color:'#64748B', fontFamily:'monospace' }}>AUM: ${p.total.toLocaleString()}</span>
                  <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#00D97E', fontFamily:'monospace' }}>+{p.return}%</span>
                  <div style={{ width:100, height:6, background:'#CBD5E1', borderRadius:3 }}>
                    <div style={{ height:'100%', width:`${(p.return/25)*100}%`, background:'linear-gradient(90deg,#00D97E,#00B87E)', borderRadius:3 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={gridCols(3)}>
            {portfoliosList.map(p => (
              <div key={p.clientId} style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden', transition:'box-shadow .2s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow='none')}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', fontWeight:700, color:'#FFF', flexShrink:0 }}>{p.clientName.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#1E293B' }}>{p.clientName}</div>
                      <div style={{ fontSize:'0.65rem', color:'#64748B' }}>{p.advisor}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#00D97E' }}>+{p.return}%</span>
                    <button onClick={() => setDeletePortfolioId(p.clientId)}
                      style={{ width:22, height:22, background:'rgba(255,69,96,0.1)', border:'1px solid rgba(255,69,96,0.2)', borderRadius:5, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#FF4560', padding:0 }}>
                      <Trash2 size={11}/>
                    </button>
                  </div>
                </div>
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <span style={{ fontSize:'0.72rem', color:'#64748B' }}>إجمالي المحفظة</span>
                    <span style={{ fontSize:'1rem', fontWeight:800, color:'#0EA5E9', fontFamily:'monospace' }}>${p.total.toLocaleString()}</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {p.assets.map((a, ai) => (
                      <div key={ai} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:6, height:6, borderRadius:'50%', background:assetColors[a.type]||'#64748B', flexShrink:0 }}/>
                        <span style={{ fontSize:'0.72rem', color:'#1E293B', flex:1 }}>{a.name}</span>
                        <span style={{ fontSize:'0.7rem', color:'#64748B', fontFamily:'monospace' }}>${a.value.toLocaleString()}</span>
                        <span style={{ fontSize:'0.68rem', fontWeight:600, color:a.change>=0?'#00D97E':'#FF4560', fontFamily:'monospace' }}>{a.change>=0?'+':''}{a.change}%</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:12, height:6, background:'#CBD5E1', borderRadius:3, overflow:'hidden', display:'flex' }}>
                    {p.assets.map((a, ai) => (
                      <div key={ai} style={{ height:'100%', flex:a.value/p.total, background:assetColors[a.type]||'#64748B' }}/>
                    ))}
                  </div>
                  <div style={{ marginTop:10, display:'flex', gap:6 }}>
                    <button onClick={() => showPToast(`📄 تقرير ${p.clientName}`)}
                      style={{ flex:1, padding:7, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:7, color:'#3B82F6', fontSize:'0.7rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>📊 تقرير</button>
                    <button onClick={() => showPToast(`✏️ تعديل محفظة ${p.clientName}`)}
                      style={{ flex:1, padding:7, background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:7, color:'#0EA5E9', fontSize:'0.7rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>✏️ تعديل</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          CREATE PORTFOLIO FORM
      ═══════════════════════════════════════ */}
      {mainTab === 'create' && (
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Disclaimer */}
          <div style={{ background:'linear-gradient(135deg,rgba(255,69,96,0.06),rgba(245,158,11,0.06))', border:'1px solid rgba(245,158,11,0.3)', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:12 }}>
            <span style={{ fontSize:'1.3rem', flexShrink:0 }}>⚠️</span>
            <div>
              <div style={{ fontSize:'0.88rem', fontWeight:700, color:'#1E293B', marginBottom:4 }}>إشعار — نموذج إنشاء محفظة استثمارية</div>
              <div style={{ fontSize:'0.78rem', color:'#475569', lineHeight:1.8 }}>
                جميع الحقول <strong>اختيارية</strong>. الحقول التي تختار إظهارها ستظهر لاحقاً في لوحة العميل.
                يمكنك إدخال قيمة مخصصة في أي حقل بكتابتها مباشرةً أسفل القائمة المنسدلة.
              </div>
            </div>
          </div>

          {/* ── 1. البيانات الشخصية ── */}
          <SectionCard title="البيانات الشخصية والأساسية" icon="👤" open={openSections.personal} onToggle={() => toggleSection('personal')}>
            <div style={gridCols(3)}>
              <FlexField label="العميل المرتبط" fkey="clientId" state={personalFS} onUpdate={updatePersonal} options={clientOptions}/>
              <FlexField label="كود المحفظة" fkey="portfolioCode" state={personalFS} onUpdate={updatePersonal} placeholder="PF-007"/>
              <FlexField label="المستشار المسؤول" fkey="advisor" state={personalFS} onUpdate={updatePersonal} options={advisorOptions}/>
              <FlexField label="الاسم الكامل" fkey="fullName" state={personalFS} onUpdate={updatePersonal} placeholder="كما في الهوية"/>
              <FlexField label="الجنسية" fkey="nationality" state={personalFS} onUpdate={updatePersonal} options={['سعودي','إماراتي','كويتي','بحريني','قطري','عماني','مصري','أردني','لبناني','أخرى']}/>
              <FlexField label="نوع الهوية" fkey="idType" state={personalFS} onUpdate={updatePersonal} options={['هوية وطنية','جواز سفر','إقامة','بطاقة عائلية']}/>
              <FlexField label="رقم الهوية" fkey="idNumber" state={personalFS} onUpdate={updatePersonal} mono/>
              <FlexField label="تاريخ انتهاء الهوية" fkey="idExpiry" state={personalFS} onUpdate={updatePersonal} type="date"/>
              <FlexField label="تاريخ فتح المحفظة" fkey="openDate" state={personalFS} onUpdate={updatePersonal} type="date"/>
              <FlexField label="الهاتف" fkey="phone" state={personalFS} onUpdate={updatePersonal} placeholder="+966501234567" mono/>
              <FlexField label="هاتف بديل" fkey="altPhone" state={personalFS} onUpdate={updatePersonal} placeholder="+966501234567" mono/>
              <FlexField label="البريد الإلكتروني" fkey="email" state={personalFS} onUpdate={updatePersonal} type="email"/>
              <FlexField label="العنوان" fkey="address" state={personalFS} onUpdate={updatePersonal}/>
              <FlexField label="المدينة" fkey="city" state={personalFS} onUpdate={updatePersonal} options={['الرياض','جدة','مكة','المدينة','الدمام','الخبر','تبوك','أبها','حائل','جيزان','أخرى']}/>
              <FlexField label="الدولة" fkey="country" state={personalFS} onUpdate={updatePersonal} options={['السعودية','الإمارات','الكويت','البحرين','قطر','عُمان','الأردن','مصر','لبنان','أخرى']}/>
              <FlexField label="مستوى المخاطرة" fkey="riskLevel" state={personalFS} onUpdate={updatePersonal} options={['منخفض','منخفض–متوسط','متوسط','متوسط–مرتفع','مرتفع']}/>
              <FlexField label="هدف الاستثمار" fkey="investmentGoal" state={personalFS} onUpdate={updatePersonal} options={['نمو رأس المال','دخل دوري','الحفاظ على الثروة','التقاعد','تعليم الأبناء','أخرى']}/>
              <FlexField label="أفق الاستثمار" fkey="investmentHorizon" state={personalFS} onUpdate={updatePersonal} options={['أقل من سنة','1–3 سنوات','3–5 سنوات','5–10 سنوات','أكثر من 10 سنوات']}/>
              <FlexField label="عملة المحفظة" fkey="currency" state={personalFS} onUpdate={updatePersonal} options={['USD','SAR','AED','EUR','GBP','KWD','QAR','BHD','OMR']}/>
            </div>
          </SectionCard>

          {/* ── 2. الوضع المالي ── */}
          <SectionCard title="الوضع المالي والاستثماري" icon="💰" open={openSections.financial} onToggle={() => toggleSection('financial')}>
            <div style={gridCols(3)}>
              <FlexField label="رأس المال الابتدائي" fkey="initialCapital" state={financialFS} onUpdate={updateFinancial} placeholder="100,000" mono/>
              <FlexField label="الإضافة الشهرية" fkey="monthlyAddition" state={financialFS} onUpdate={updateFinancial} placeholder="5,000" mono/>
              <FlexField label="الدخل السنوي التقريبي" fkey="annualIncome" state={financialFS} onUpdate={updateFinancial} placeholder="200,000" mono/>
              <FlexField label="صافي الثروة المقدّرة" fkey="netWorth" state={financialFS} onUpdate={updateFinancial} placeholder="1,000,000" mono/>
              <FlexField label="استثمارات أخرى (قيمة)" fkey="otherInvestments" state={financialFS} onUpdate={updateFinancial} placeholder="500,000" mono/>
              <FlexField label="المصروفات الشهرية" fkey="monthlyExpenses" state={financialFS} onUpdate={updateFinancial} placeholder="10,000" mono/>
              <FlexField label="الاحتياطي السائل (أشهر)" fkey="liquidReserve" state={financialFS} onUpdate={updateFinancial} placeholder="6" mono/>
              <FlexField label="أقصى خسارة مقبولة %" fkey="maxLoss" state={financialFS} onUpdate={updateFinancial} placeholder="20" mono/>
              <FlexField label="تحمّل المخاطر" fkey="riskTolerance" state={financialFS} onUpdate={updateFinancial} options={['منخفض','متوسط','مرتفع','مرتفع جداً']}/>
              <FlexField label="خبرة استثمارية سابقة" fkey="previousExp" state={financialFS} onUpdate={updateFinancial} options={['نعم','لا','محدودة','خبير']}/>
              <FlexField label="مقيم ضريبي في" fkey="taxResident" state={financialFS} onUpdate={updateFinancial} options={['السعودية','الإمارات','الكويت','البحرين','قطر','عُمان','خارج الخليج']}/>
              <FlexField label="مواطن أمريكي / FATCA" fkey="usCitizen" state={financialFS} onUpdate={updateFinancial} options={['لا','نعم','غير منطبق']}/>
            </div>
          </SectionCard>

          {/* ── 3. الاستثمارات ── */}
          <SectionCard title="الاستثمارات والأصول" icon="📊" open={openSections.investments} onToggle={() => toggleSection('investments')}>
            {/* Sub-tabs */}
            <div style={{ display:'flex', gap:2, flexWrap:'wrap', marginBottom:20, background:'#F1F5F9', borderRadius:8, padding:3 }}>
              {investTabs.map(t => (
                <button key={t.key} type="button" onClick={() => setInvestTab(t.key as any)}
                  style={{ padding:'6px 12px', background:investTab===t.key?'#FFFFFF':'transparent', border:'none', borderRadius:6, color:investTab===t.key?'#0EA5E9':'#64748B', fontSize:'0.75rem', fontWeight:investTab===t.key?700:400, cursor:'pointer', fontFamily:"'Cairo',sans-serif", display:'flex', alignItems:'center', gap:5, boxShadow:investTab===t.key?'0 1px 3px rgba(0,0,0,0.1)':'none', whiteSpace:'nowrap' }}>
                  {t.label}
                  {t.count > 0 && <span style={{ background:'rgba(14,165,233,0.2)', color:'#0EA5E9', borderRadius:8, padding:'1px 6px', fontSize:'0.6rem', fontWeight:700 }}>{t.count}</span>}
                </button>
              ))}
            </div>

            {investTab === 'sa' && (
              <InvestmentTable rows={saStocks} onAdd={() => setSaStocks(r => [...r, { code:'', name:'', qty:'', price:'', notes:'' }])}
                onRemove={makeRowRemover(setSaStocks)} onChange={makeRowUpdater(setSaStocks)}
                sectionLabel="أسهم سعودية" sectionVisible={investVisible.sa} onSectionVisibleChange={v => setInvestVisible(s => ({ ...s, sa:v }))}
                columns={[{key:'code',label:'الرمز',type:'select',options:saOptions},{key:'qty',label:'الكمية'},{key:'price',label:'السعر (ر.س)'},{key:'notes',label:'ملاحظة'}]}/>
            )}
            {investTab === 'gulf' && (
              <InvestmentTable rows={gulfStocks} onAdd={() => setGulfStocks(r => [...r, { code:'', name:'', qty:'', price:'', notes:'' }])}
                onRemove={makeRowRemover(setGulfStocks)} onChange={makeRowUpdater(setGulfStocks)}
                sectionLabel="أسهم خليجية" sectionVisible={investVisible.gulf} onSectionVisibleChange={v => setInvestVisible(s => ({ ...s, gulf:v }))}
                columns={[{key:'code',label:'الرمز'},{key:'name',label:'اسم الشركة'},{key:'qty',label:'الكمية'},{key:'price',label:'السعر'},{key:'notes',label:'ملاحظة'}]}/>
            )}
            {investTab === 'global' && (
              <InvestmentTable rows={globalStocks} onAdd={() => setGlobalStocks(r => [...r, { code:'', name:'', qty:'', price:'', notes:'' }])}
                onRemove={makeRowRemover(setGlobalStocks)} onChange={makeRowUpdater(setGlobalStocks)}
                sectionLabel="أسهم عالمية" sectionVisible={investVisible.global} onSectionVisibleChange={v => setInvestVisible(s => ({ ...s, global:v }))}
                columns={[{key:'code',label:'الرمز',type:'select',options:globalOptions},{key:'qty',label:'الأسهم'},{key:'price',label:'السعر ($)'},{key:'notes',label:'ملاحظة'}]}/>
            )}
            {investTab === 'crypto' && (
              <InvestmentTable rows={cryptoRows} onAdd={() => setCryptoRows(r => [...r, { symbol:'', qty:'', avgPrice:'' }])}
                onRemove={makeRowRemover(setCryptoRows)} onChange={makeRowUpdater(setCryptoRows)}
                sectionLabel="عملات رقمية" sectionVisible={investVisible.crypto} onSectionVisibleChange={v => setInvestVisible(s => ({ ...s, crypto:v }))}
                columns={[{key:'symbol',label:'العملة',type:'select',options:CRYPTO_LIST},{key:'qty',label:'الكمية'},{key:'avgPrice',label:'متوسط السعر ($)'}]}/>
            )}
            {investTab === 'forex' && (
              <InvestmentTable rows={forexRows} onAdd={() => setForexRows(r => [...r, { pair:'', lots:'', direction:'شراء', avgPrice:'' }])}
                onRemove={makeRowRemover(setForexRows)} onChange={makeRowUpdater(setForexRows)}
                sectionLabel="فوركس" sectionVisible={investVisible.forex} onSectionVisibleChange={v => setInvestVisible(s => ({ ...s, forex:v }))}
                columns={[{key:'pair',label:'الزوج',type:'select',options:FOREX_PAIRS_LIST},{key:'lots',label:'اللوتات'},{key:'direction',label:'الاتجاه',type:'select',options:['شراء','بيع']},{key:'avgPrice',label:'متوسط السعر'}]}/>
            )}
            {investTab === 'metals' && (
              <InvestmentTable rows={metalRows} onAdd={() => setMetalRows(r => [...r, { metal:'', weight:'', unit:'أوقية', avgPrice:'' }])}
                onRemove={makeRowRemover(setMetalRows)} onChange={makeRowUpdater(setMetalRows)}
                sectionLabel="معادن" sectionVisible={investVisible.metals} onSectionVisibleChange={v => setInvestVisible(s => ({ ...s, metals:v }))}
                columns={[{key:'metal',label:'المعدن',type:'select',options:METALS_LIST},{key:'weight',label:'الوزن/الكمية'},{key:'unit',label:'الوحدة',type:'select',options:['أوقية','جرام','كيلو']},{key:'avgPrice',label:'متوسط السعر ($)'}]}/>
            )}
            {investTab === 'oil' && (
              <InvestmentTable rows={oilRows} onAdd={() => setOilRows(r => [...r, { type:'', contracts:'', avgPrice:'' }])}
                onRemove={makeRowRemover(setOilRows)} onChange={makeRowUpdater(setOilRows)}
                sectionLabel="النفط" sectionVisible={investVisible.oil} onSectionVisibleChange={v => setInvestVisible(s => ({ ...s, oil:v }))}
                columns={[{key:'type',label:'النوع',type:'select',options:OIL_TYPES_LIST},{key:'contracts',label:'العقود'},{key:'avgPrice',label:'متوسط السعر ($)'}]}/>
            )}
          </SectionCard>

          {/* ── 4. البيانات البنكية ── */}
          <SectionCard title="البيانات البنكية" icon="🏦" open={openSections.banking} onToggle={() => toggleSection('banking')}>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#1E293B', marginBottom:12 }}>الحساب البنكي الرئيسي</div>
              <div style={gridCols(3)}>
                <FlexField label="اسم البنك" fkey="bankName" state={bankingFS} onUpdate={updateBanking} options={BANKS_SA_LIST}/>
                <FlexField label="رقم IBAN" fkey="iban" state={bankingFS} onUpdate={updateBanking} placeholder="SA00 0000 0000 0000 0000 0000" mono/>
                <FlexField label="اسم صاحب الحساب" fkey="accountName" state={bankingFS} onUpdate={updateBanking}/>
                <FlexField label="الفرع" fkey="branch" state={bankingFS} onUpdate={updateBanking}/>
                <FlexField label="رمز SWIFT" fkey="swiftCode" state={bankingFS} onUpdate={updateBanking} mono/>
                <FlexField label="طريقة التحويل المفضلة" fkey="transferMethod" state={bankingFS} onUpdate={updateBanking} options={['حوالة بنكية','SWIFT','عبر التطبيق','تحويل فوري','أخرى']}/>
              </div>
            </div>
            <div style={{ borderTop:'1px solid #E2E8F0', paddingTop:16 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#1E293B', marginBottom:12 }}>حساب بنكي ثانوي</div>
              <div style={gridCols(3)}>
                <FlexField label="اسم البنك الثانوي" fkey="secondBankName" state={bankingFS} onUpdate={updateBanking} options={BANKS_SA_LIST}/>
                <FlexField label="IBAN الثانوي" fkey="secondIBAN" state={bankingFS} onUpdate={updateBanking} placeholder="SA00..." mono/>
                <FlexField label="اسم الحساب الثانوي" fkey="secondAccountName" state={bankingFS} onUpdate={updateBanking}/>
              </div>
            </div>
          </SectionCard>

          {/* ── 5. المستندات ── */}
          <SectionCard title="المستندات والوثائق" icon="📎" open={openSections.docs} onToggle={() => toggleSection('docs')}>
            <div style={gridCols(3)}>
              {[
                { k:'idCopy',         l:'صورة الهوية / الجواز' },
                { k:'addressProof',   l:'إثبات العنوان' },
                { k:'bankStatement',  l:'كشف حساب بنكي (3 أشهر)' },
                { k:'taxForm',        l:'نموذج معلومات ضريبية' },
                { k:'riskForm',       l:'نموذج المخاطرة الموقّع' },
                { k:'contractSigned', l:'عقد إدارة المحفظة' },
              ].map(d => {
                const isUploaded = docsFS[d.k]?.value === 'نعم'
                const isVisible  = docsFS[d.k]?.visible ?? true
                return (
                  <div key={d.k} style={{ ...C.fieldBox, borderColor: isUploaded ? 'rgba(0,217,126,0.4)' : '#E2E8F0' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontSize:'0.78rem', fontWeight:600, color:'#1E293B' }}>{d.l}</div>
                        <div style={{ fontSize:'0.65rem', color:'#64748B', marginTop:3 }}>{isUploaded ? '✅ تم الرفع' : 'لم يُرفع بعد'}</div>
                      </div>
                      <button type="button"
                        onClick={() => updateDocs(d.k, { value: isUploaded ? 'لا' : 'نعم' })}
                        style={{ width:30, height:30, background:isUploaded?'rgba(0,217,126,0.15)':'#F1F5F9', border:`1px solid ${isUploaded?'rgba(0,217,126,0.3)':'#E2E8F0'}`, borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:isUploaded?'#00D97E':'#64748B', padding:0 }}>
                        {isUploaded ? <Check size={14}/> : <Upload size={14}/>}
                      </button>
                    </div>
                    <VisibilityToggle visible={isVisible} onChange={v => updateDocs(d.k, { visible: v })}/>
                  </div>
                )
              })}
            </div>
            <div style={{ ...gridCols(3), marginTop:14 }}>
              <FlexField label="حالة KYC" fkey="kycStatus" state={docsFS} onUpdate={updateDocs} options={['مكتمل','جزئي','معلق','مرفوض','قيد المراجعة']}/>
              <FlexField label="تاريخ التحقق" fkey="verificationDate" state={docsFS} onUpdate={updateDocs} type="date"/>
              <FlexField label="تم التحقق بواسطة" fkey="verifiedBy" state={docsFS} onUpdate={updateDocs} options={advisorOptions}/>
            </div>
          </SectionCard>

          {/* ── 6. ملاحظات الأدمن ── */}
          <SectionCard title="ملاحظات المشرف الداخلية" icon="📝" open={openSections.notes} onToggle={() => toggleSection('notes')}>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <FlexField label="ملاحظات داخلية" fkey="internalNotes" state={notesFS} onUpdate={updateNotes} type="textarea" placeholder="ملاحظات خاصة بالفريق..."/>
              <div style={gridCols(2)}>
                <FlexField label="شروط خاصة" fkey="specialConditions" state={notesFS} onUpdate={updateNotes} type="textarea" placeholder="أي شروط استثنائية..."/>
                <FlexField label="تعديل الرسوم" fkey="feeOverride" state={notesFS} onUpdate={updateNotes} placeholder="مثال: 0.8% بدلاً من 1%"/>
              </div>
              <div style={gridCols(3)}>
                <FlexField label="مستوى الأولوية" fkey="priorityLevel" state={notesFS} onUpdate={updateNotes} options={['عادي','متوسط','عالٍ','VIP','طارئ']}/>
                <FlexField label="تاريخ المتابعة التالية" fkey="followUpDate" state={notesFS} onUpdate={updateNotes} type="date"/>
                <FlexField label="وسوم / Tags" fkey="tags" state={notesFS} onUpdate={updateNotes} placeholder="VIP, حساس, عميل قديم..."/>
              </div>
            </div>
          </SectionCard>

          {/* Submit Bar */}
          <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div style={{ fontSize:'0.78rem', color:'#64748B' }}>
              جميع الحقول اختيارية — فقط الحقول التي اخترت <strong>إظهارها</strong> ستظهر لاحقاً في لوحة العميل.
            </div>
            <div style={{ display:'flex', gap:10, flexShrink:0 }}>
              <button type="button" onClick={() => setMainTab('list')}
                style={{ padding:'10px 20px', background:'transparent', border:'1px solid #E2E8F0', borderRadius:8, color:'#64748B', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontSize:'0.85rem' }}>
                إلغاء
              </button>
              <button type="submit"
                style={{ padding:'10px 24px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:8, color:'#FFF', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'Cairo',sans-serif", display:'flex', alignItems:'center', gap:6 }}>
                {saved ? <><Check size={16}/> تم الحفظ!</> : '💾 حفظ المحفظة'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Delete Modal */}
      {deletePortfolioId !== null && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#FFFFFF', borderRadius:16, padding:28, width:360, textAlign:'center', boxShadow:'0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize:'2rem', marginBottom:12 }}>🗑️</div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:'#1E293B', marginBottom:8 }}>حذف المحفظة</div>
            <div style={{ fontSize:'0.82rem', color:'#64748B', marginBottom:22 }}>هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setDeletePortfolioId(null)}
                style={{ flex:1, padding:10, border:'1px solid #E2E8F0', borderRadius:9, background:'#F8FAFC', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontWeight:600, fontSize:'0.83rem', color:'#64748B' }}>
                إلغاء
              </button>
              <button onClick={() => handleDeletePortfolio(deletePortfolioId)}
                style={{ flex:1, padding:10, border:'none', borderRadius:9, background:'linear-gradient(135deg,#EF4444,#DC2626)', cursor:'pointer', fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:'0.83rem', color:'#FFF' }}>
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {portfolioToast && (
        <div style={{ position:'fixed', bottom:28, right:28, zIndex:300, padding:'12px 20px', borderRadius:12, background:'#1E293B', color:'#FFF', fontWeight:700, fontSize:'0.83rem', boxShadow:'0 8px 30px rgba(0,0,0,0.2)', fontFamily:"'Cairo',sans-serif" }}>
          {portfolioToast}
        </div>
      )}
    </div>
  )
}
