import { useState } from 'react'
import { Search, Plus, X, TrendingUp, TrendingDown } from 'lucide-react'
import { mockTransactions } from '../adminData'

const C = {
  card: { background:'#0C1A2E', border:'1px solid #1A2E4A', borderRadius:14, overflow:'hidden' } as React.CSSProperties,
  th: { padding:'11px 14px', textAlign:'right' as const, fontSize:'0.7rem', fontWeight:600, color:'#6B84A8', borderBottom:'1px solid #1A2E4A', background:'#060E1A', whiteSpace:'nowrap' as const },
  td: { padding:'12px 14px', fontSize:'0.8rem', color:'#E2E8F4', borderBottom:'1px solid rgba(26,46,74,0.4)', verticalAlign:'middle' as const },
}

const typeMap: Record<string,{bg:string;color:string;label:string}> = {
  buy:{bg:'rgba(0,217,126,0.1)',color:'#00D97E',label:'شراء'},
  sell:{bg:'rgba(255,69,96,0.1)',color:'#FF4560',label:'بيع'},
  transfer:{bg:'rgba(59,130,246,0.1)',color:'#3B82F6',label:'تحويل'},
}

const statusMap: Record<string,{bg:string;color:string;label:string}> = {
  completed:{bg:'rgba(0,217,126,0.1)',color:'#00D97E',label:'مكتمل'},
  pending:{bg:'rgba(245,158,11,0.1)',color:'#F59E0B',label:'معلق'},
  rejected:{bg:'rgba(255,69,96,0.1)',color:'#FF4560',label:'مرفوض'},
}

const assets = ['أرامكو','BTC','ETH','ذهب','Apple','Microsoft','نفط برنت','Tesla','EUR/USD']

export default function Transactions() {
  const [showModal, setShowModal] = useState(false)
  const [txType, setTxType] = useState<'buy'|'sell'|'transfer'>('buy')
  const [qty, setQty] = useState('')
  const [price, setPrice] = useState('')
  const [asset, setAsset] = useState('')
  const [client, setClient] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showApprove, setShowApprove] = useState<number|null>(null)

  const total = parseFloat(qty||'0') * parseFloat(price||'0')

  const filtered = mockTransactions.filter(tx => {
    if (search && !tx.client.includes(search) && !tx.asset.includes(search)) return false
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false
    return true
  })

  const summaryCards = [
    {label:'صفقات اليوم',value:'34',sub:'صفقة',icon:'⚡',color:'#C9A84C'},
    {label:'هذا الشهر',value:'234',sub:'صفقة',icon:'📅',color:'#3B82F6'},
    {label:'حجم الشهر',value:'$18.4M',sub:'إجمالي',icon:'💰',color:'#00D97E'},
    {label:'معلقة',value:'7',sub:'تحتاج موافقة',icon:'⏳',color:'#F59E0B'},
    {label:'شراء',value:mockTransactions.filter(t=>t.type==='buy').length.toString(),sub:'صفقة',icon:'📈',color:'#00D97E'},
    {label:'بيع',value:mockTransactions.filter(t=>t.type==='sell').length.toString(),sub:'صفقة',icon:'📉',color:'#FF4560'},
  ]

  const pendingTx = mockTransactions.filter(t=>t.status==='pending')

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#E2E8F4',margin:0}}>العمليات والصفقات</h1>
          <p style={{fontSize:'0.78rem',color:'#6B84A8',marginTop:3}}>{mockTransactions.length} عملية مسجلة</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,color:'#060E1A',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
          <Plus size={14}/> إضافة عملية
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:14}}>
        {summaryCards.map((c,i) => (
          <div key={i} style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:12,padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:'0.68rem',color:'#6B84A8',fontWeight:600}}>{c.label}</span>
              <span style={{fontSize:'1rem'}}>{c.icon}</span>
            </div>
            <div style={{fontSize:'1.4rem',fontWeight:800,color:c.color,fontFamily:'monospace',lineHeight:1,marginBottom:2}}>{c.value}</div>
            <div style={{fontSize:'0.65rem',color:'#6B84A8'}}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {pendingTx.length > 0 && (
        <div style={{background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:12,padding:'14px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <span>⏳</span>
            <span style={{fontSize:'0.85rem',fontWeight:700,color:'#F59E0B'}}>صفقات تنتظر الموافقة</span>
            <span style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B',borderRadius:10,padding:'2px 8px',fontSize:'0.65rem',fontWeight:700}}>{pendingTx.length}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {pendingTx.map(tx => (
              <div key={tx.id} style={{background:'#0A1628',border:'1px solid #1A2E4A',borderRadius:8,padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
                  <span style={{...typeMap[tx.type],borderRadius:20,padding:'3px 10px',fontSize:'0.7rem',fontWeight:700}}>{typeMap[tx.type]?.label}</span>
                  <span style={{fontSize:'0.82rem',color:'#E2E8F4',fontWeight:600}}>{tx.client}</span>
                  <span style={{fontSize:'0.78rem',color:'#6B84A8'}}>—</span>
                  <span style={{fontSize:'0.82rem',color:'#E2E8F4'}}>{tx.asset}</span>
                  <span style={{fontSize:'0.82rem',color:'#C9A84C',fontFamily:'monospace',fontWeight:700}}>${tx.total.toLocaleString()}</span>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button style={{padding:'5px 12px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:6,color:'#00D97E',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✓ موافقة</button>
                  <button style={{padding:'5px 12px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:6,color:'#FF4560',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✕ رفض</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={C.card}>
        <div style={{padding:'12px 14px',borderBottom:'1px solid #1A2E4A',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:2,background:'#060E1A',borderRadius:8,padding:3}}>
            {[{k:'all',l:'الكل'},{k:'buy',l:'شراء'},{k:'sell',l:'بيع'},{k:'transfer',l:'تحويل'}].map(t => (
              <button key={t.k} onClick={()=>setTypeFilter(t.k)} style={{padding:'5px 10px',background: typeFilter===t.k ? '#0C1A2E' : 'transparent',border:'none',borderRadius:6,color: typeFilter===t.k ? '#E2E8F4' : '#6B84A8',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{t.l}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:2,background:'#060E1A',borderRadius:8,padding:3}}>
            {[{k:'all',l:'كل الحالات'},{k:'completed',l:'مكتمل'},{k:'pending',l:'معلق'}].map(t => (
              <button key={t.k} onClick={()=>setStatusFilter(t.k)} style={{padding:'5px 10px',background: statusFilter===t.k ? '#0C1A2E' : 'transparent',border:'none',borderRadius:6,color: statusFilter===t.k ? '#E2E8F4' : '#6B84A8',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{t.l}</button>
            ))}
          </div>
          <div style={{flex:1,display:'flex',alignItems:'center',gap:8,background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,padding:'7px 12px'}}>
            <Search size={13} color="#6B84A8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{background:'none',border:'none',outline:'none',color:'#E2E8F4',fontSize:'0.78rem',fontFamily:"'Cairo',sans-serif",flex:1}}/>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
            <thead>
              <tr>{['#','النوع','العميل','الأصل','الكمية','السعر','الإجمالي','الحالة','التاريخ','إجراء'].map(h=>(
                <th key={h} style={C.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{...C.td,fontFamily:'monospace',color:'#4A6080',fontSize:'0.72rem'}}>#{tx.id}</td>
                  <td style={C.td}><span style={{...typeMap[tx.type],borderRadius:20,padding:'3px 9px',fontSize:'0.68rem',fontWeight:700}}>{typeMap[tx.type]?.label}</span></td>
                  <td style={C.td}>{tx.client}</td>
                  <td style={{...C.td,fontWeight:600}}>{tx.asset}</td>
                  <td style={{...C.td,fontFamily:'monospace'}}>{tx.qty}</td>
                  <td style={{...C.td,fontFamily:'monospace'}}>${tx.price.toLocaleString()}</td>
                  <td style={{...C.td,fontFamily:'monospace',fontWeight:700,color:'#C9A84C'}}>${tx.total.toLocaleString()}</td>
                  <td style={C.td}><span style={{...statusMap[tx.status],borderRadius:20,padding:'3px 9px',fontSize:'0.68rem',fontWeight:600}}>{statusMap[tx.status]?.label}</span></td>
                  <td style={{...C.td,fontSize:'0.7rem',color:'#6B84A8',whiteSpace:'nowrap'}}>{tx.date}</td>
                  <td style={C.td}>
                    {tx.status === 'pending' ? (
                      <div style={{display:'flex',gap:4}}>
                        <button style={{padding:'3px 8px',background:'rgba(0,217,126,0.1)',border:'1px solid rgba(0,217,126,0.3)',borderRadius:5,color:'#00D97E',fontSize:'0.62rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✓</button>
                        <button style={{padding:'3px 8px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.3)',borderRadius:5,color:'#FF4560',fontSize:'0.62rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✕</button>
                      </div>
                    ) : (
                      <span style={{fontSize:'0.65rem',color:'#4A6080'}}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:'10px 14px',borderTop:'1px solid #1A2E4A',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:'0.7rem',color:'#6B84A8'}}>إجمالي {filtered.length} عملية</span>
          <div style={{display:'flex',gap:4}}>
            {[1,2,3].map(p=><button key={p} style={{width:26,height:26,background: p===1?'rgba(201,168,76,0.15)':'transparent',border:`1px solid ${p===1?'rgba(201,168,76,0.3)':'#1A2E4A'}`,borderRadius:5,color: p===1?'#C9A84C':'#6B84A8',fontSize:'0.72rem',cursor:'pointer'}}>{p}</button>)}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(6,14,26,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setShowModal(false)}>
          <div style={{background:'#0A1628',border:'1px solid #1A2E4A',borderRadius:16,width:520,padding:0}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #1A2E4A',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,fontSize:'0.9rem',color:'#E2E8F4'}}>إضافة عملية جديدة</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#6B84A8',display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'flex',gap:8}}>
                {(['buy','sell','transfer'] as const).map(t => (
                  <button key={t} onClick={()=>setTxType(t)} style={{flex:1,padding:'10px',background: txType===t ? typeMap[t]?.bg : '#060E1A',border:`1px solid ${txType===t ? typeMap[t]?.color+'55' : '#1A2E4A'}`,borderRadius:8,color: txType===t ? typeMap[t]?.color : '#6B84A8',fontWeight: txType===t ? 700 : 400,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem'}}>
                    {typeMap[t]?.label}
                  </button>
                ))}
              </div>
              {[{label:'اسم العميل',value:client,set:setClient,placeholder:'محمد الأحمد'},{label:'الأصل',value:asset,set:setAsset,placeholder:'أرامكو / BTC ...'},{label:'الكمية',value:qty,set:setQty,placeholder:'100'},{label:'سعر الوحدة ($)',value:price,set:setPrice,placeholder:'124.50'}].map(f => (
                <div key={f.label}>
                  <div style={{fontSize:'0.72rem',color:'#6B84A8',fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <input value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={{width:'100%',padding:'10px 12px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}}
                    onFocus={e=>e.target.style.borderColor='#C9A84C'}
                    onBlur={e=>e.target.style.borderColor='#1A2E4A'}/>
                </div>
              ))}
              {total > 0 && (
                <div style={{background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:8,padding:'12px 14px',display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontSize:'0.78rem',color:'#6B84A8'}}>الإجمالي المتوقع</span>
                  <span style={{fontSize:'1.1rem',fontWeight:800,color:'#C9A84C',fontFamily:'monospace'}}>${total.toLocaleString()}</span>
                </div>
              )}
              <button style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,color:'#060E1A',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>
                ✓ تأكيد العملية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
