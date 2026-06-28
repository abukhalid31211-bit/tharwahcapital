import { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { chartAUM, chartPortfolioAlloc, chartRevenue } from '../adminData'
import { getOverview } from '../../../lib/api'
import type { Transaction } from '../../../lib/api'

const C = { card: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14 } as React.CSSProperties }

const marketTickers = [
  { name:'أرامكو', value:'124.40', change:'+2.1%', pos:true },
  { name:'BTC', value:'$67,240', change:'+3.4%', pos:true },
  { name:'ذهب', value:'$2,340', change:'+0.9%', pos:true },
  { name:'Apple', value:'$189.5', change:'-1.2%', pos:false },
  { name:'نفط', value:'$87.3', change:'-0.4%', pos:false },
  { name:'EUR/USD', value:'1.0842', change:'+0.2%', pos:true },
]

const quickActions = [
  { icon:'➕', label:'إضافة عميل', color:'#3B82F6' },
  { icon:'💸', label:'صفقة جديدة', color:'#0EA5E9' },
  { icon:'📊', label:'إنشاء تقرير', color:'#00D97E' },
  { icon:'📰', label:'نشر خبر', color:'#F59E0B' },
  { icon:'👤', label:'إضافة مشرف', color:'#8B5CF6' },
  { icon:'📧', label:'إرسال بريد', color:'#EC4899' },
]

function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString('ar-SA', { year:'numeric', month:'short', day:'numeric' }) } catch { return d }
}

function fmtAmount(n?: number) {
  if (n == null || n === 0) return '—'
  return new Intl.NumberFormat('ar-SA').format(n)
}

type OverviewData = Awaited<ReturnType<typeof getOverview>>

export default function Overview() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور'

  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getOverview()
      .then(d => { setData(d); setLoading(false) })
      .catch((e: Error) => { setError(e.message); setLoading(false) })
  }, [])

  const kpis = data ? [
    { label:'إجمالي العملاء',    value: String(data.kpis.totalClients),              change:`${data.kpis.activeClients} نشط`,        icon:'👥', color:'#3B82F6', positive:true  },
    { label:'عملاء نشطون',       value: String(data.kpis.activeClients),             change:`${data.kpis.inactiveClients} غير نشط`,  icon:'✅', color:'#00D97E', positive:true  },
    { label:'إجمالي الإيداعات',  value:`$${fmtAmount(data.kpis.totalDeposits)}`,    change:'مكتملة',                               icon:'💰', color:'#0EA5E9', positive:true  },
    { label:'صافي الأصول',       value:`$${fmtAmount(data.kpis.netAssets)}`,        change:'إيداع — سحب',                          icon:'📈', color:'#C9A84C', positive:true  },
    { label:'رسائل جديدة',       value: String(data.kpis.newMessages),              change:`من ${data.kpis.totalMessages} رسالة`,   icon:'💬', color:'#F59E0B', positive:false },
    { label:'معاملات معلقة',     value: String(data.kpis.pendingTransactions),      change:'تحتاج مراجعة',                         icon:'📋', color:'#FF4560', positive:false },
    { label:'إجمالي المعاملات',  value: String(data.kpis.totalTransactions),        change:'في النظام',                            icon:'⚡', color:'#0EA5E9', positive:true  },
    { label:'حالة النظام',       value:'✅ طبيعي',                                   change:'آخر فحص: الآن',                        icon:'🛡️', color:'#00D97E', positive:true  },
  ] : []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#1E293B', margin:0 }}>{greeting} 👋</h1>
          <p style={{ fontSize:'0.82rem', color:'#64748B', marginTop:4 }}>
            {now.toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            &nbsp;·&nbsp;🟢 جميع الأنظمة تعمل بشكل طبيعي
          </p>
        </div>
        <div style={{ display:'flex', gap:8, fontSize:'0.78rem' }}>
          <button style={{ padding:'8px 14px', background:'transparent', border:'1px solid #E2E8F0', borderRadius:8, color:'#64748B', cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>📅 هذا الشهر</button>
          <button style={{ padding:'8px 14px', background:'linear-gradient(135deg,#0EA5E9,#38BDF8)', border:'none', borderRadius:8, color:'#FFFFFF', fontWeight:700, cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>📥 تصدير</button>
        </div>
      </div>

      {/* Market Ticker */}
      <div style={{ ...C.card, padding:'10px 16px', display:'flex', gap:24, overflowX:'auto' }}>
        <span style={{ fontSize:'0.7rem', color:'#64748B', flexShrink:0, alignSelf:'center' }}>الأسواق:</span>
        {marketTickers.map((t,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <span style={{ fontSize:'0.78rem', color:'#1E293B', fontWeight:600 }}>{t.name}</span>
            <span style={{ fontSize:'0.78rem', color:'#1E293B', fontFamily:'monospace' }}>{t.value}</span>
            <span style={{ fontSize:'0.7rem', color: t.pos ? '#00D97E' : '#FF4560', fontWeight:600 }}>{t.change}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...C.card, padding:16, background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', fontSize:'0.8rem' }}>
          ⚠️ خطأ في تحميل البيانات: {error}
        </div>
      )}

      {/* KPI Grid */}
      {loading ? (
        <div style={{ ...C.card, padding:32, textAlign:'center', color:'#94A3B8', fontSize:'0.85rem' }}>⏳ جاري تحميل الإحصائيات...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {kpis.map((k,i) => (
            <div key={i} style={{ ...C.card, padding:20, display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.72rem', color:'#64748B', fontWeight:600 }}>{k.label}</span>
                <span style={{ fontSize:'1.2rem' }}>{k.icon}</span>
              </div>
              <div style={{ fontSize:'1.5rem', fontWeight:800, color:k.color, fontFamily:'monospace', lineHeight:1 }}>{k.value}</div>
              <div style={{ fontSize:'0.7rem', color: k.positive ? '#00D97E' : '#F59E0B' }}>{k.change}</div>
              <div style={{ height:3, background:'#CBD5E1', borderRadius:2 }}>
                <div style={{ height:'100%', width:`${40+i*7}%`, background:k.color, borderRadius:2, opacity:0.7 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B' }}>نمو الأصول المُدارة (AUM)</div>
              <div style={{ fontSize:'0.72rem', color:'#64748B', marginTop:2 }}>بالمليون دولار — آخر 12 شهراً</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartAUM}>
              <defs>
                <linearGradient id="aum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.78rem'}}/>
              <CartesianGrid stroke="rgba(203,213,225,0.6)" strokeDasharray="3 3"/>
              <Area type="monotone" dataKey="aum" stroke="#C9A84C" strokeWidth={2} fill="url(#aum)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B', marginBottom:12 }}>توزيع المحافظ</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={chartPortfolioAlloc} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                {chartPortfolioAlloc.map((_d,i) => <Cell key={i} fill={chartPortfolioAlloc[i].color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
            {chartPortfolioAlloc.map((d,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:d.color }} />
                  <span style={{ fontSize:'0.72rem', color:'#1E293B' }}>{d.name}</span>
                </div>
                <span style={{ fontSize:'0.72rem', color:'#64748B', fontFamily:'monospace' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue + Recent Clients + Quick Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 0.8fr', gap:20 }}>
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B' }}>الإيرادات والأرباح</div>
            <span style={{ fontSize:'0.7rem', color:'#64748B' }}>بالألف دولار</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartRevenue.slice(-6)}>
              <XAxis dataKey="month" tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#94A3B8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:8,color:'#1E293B',fontSize:'0.75rem'}}/>
              <CartesianGrid stroke="rgba(203,213,225,0.5)" strokeDasharray="3 3"/>
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4,4,0,0]} name="إيرادات"/>
              <Bar dataKey="profit" fill="#C9A84C" radius={[4,4,0,0]} name="أرباح"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Clients — real DB data */}
        <div style={{ ...C.card, padding:20 }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B', marginBottom:14 }}>آخر العملاء المسجلين</div>
          {loading ? (
            <div style={{ fontSize:'0.75rem', color:'#94A3B8', textAlign:'center', padding:20 }}>⏳ تحميل...</div>
          ) : (data?.recentClients || []).length === 0 ? (
            <div style={{ fontSize:'0.75rem', color:'#94A3B8', textAlign:'center', padding:20 }}>لا يوجد عملاء</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {(data?.recentClients || []).map((c, i) => (
                <div key={c.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom: i < (data!.recentClients.length-1) ? '1px solid rgba(203,213,225,0.6)' : 'none' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, color:'#3B82F6', flexShrink:0 }}>
                    {c.name?.charAt(0) || '؟'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'0.72rem', color:'#1E293B', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                      <span style={{ padding:'1px 6px', borderRadius:10, fontSize:'0.6rem', background: c.status==='active'?'rgba(0,217,126,0.1)':'rgba(245,158,11,0.1)', color: c.status==='active'?'#00D97E':'#F59E0B' }}>
                        {c.status==='active'?'نشط':'معلق'}
                      </span>
                      {c.join_date && <span style={{ fontSize:'0.6rem', color:'#94A3B8' }}>{fmtDate(c.join_date)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ ...C.card, padding:16 }}>
          <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#1E293B', marginBottom:10 }}>إجراءات سريعة</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
            {quickActions.map((q,i) => (
              <button key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 4px', background:`${q.color}11`, border:`1px solid ${q.color}33`, borderRadius:8, cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=`${q.color}22`}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=`${q.color}11`}}>
                <span style={{ fontSize:'1.2rem' }}>{q.icon}</span>
                <span style={{ fontSize:'0.6rem', color:'#1E293B', textAlign:'center', lineHeight:1.2 }}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions — real DB data */}
      <div style={{ ...C.card, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#1E293B' }}>آخر المعاملات</div>
          <span style={{ fontSize:'0.72rem', color:'#0EA5E9', cursor:'pointer' }}>عرض الكل ←</span>
        </div>
        {loading ? (
          <div style={{ padding:24, textAlign:'center', color:'#94A3B8', fontSize:'0.85rem' }}>⏳ جاري التحميل...</div>
        ) : (data?.recentTransactions || []).length === 0 ? (
          <div style={{ padding:24, textAlign:'center', color:'#94A3B8', fontSize:'0.85rem' }}>لا توجد معاملات حتى الآن</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
              <thead>
                <tr>
                  {['العميل','النوع','المبلغ','العملة','الحالة','التاريخ'].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'right', fontSize:'0.7rem', fontWeight:600, color:'#64748B', borderBottom:'1px solid #E2E8F0', background:'#F1F5F9', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.recentTransactions || []).map((tx: Transaction) => (
                  <tr key={tx.id}
                    onMouseEnter={e=>{(e.currentTarget as HTMLTableRowElement).style.background='rgba(14,165,233,0.03)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLTableRowElement).style.background='transparent'}}>
                    <td style={{ padding:'10px 16px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>{tx.clients?.name || '—'}</td>
                    <td style={{ padding:'10px 16px', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>
                      <span style={{ padding:'3px 9px', borderRadius:20, fontSize:'0.68rem', fontWeight:700,
                        background: tx.type==='deposit'?'rgba(0,217,126,0.1)':tx.type==='withdraw'?'rgba(255,69,96,0.1)':'rgba(59,130,246,0.1)',
                        color: tx.type==='deposit'?'#00D97E':tx.type==='withdraw'?'#FF4560':'#3B82F6' }}>
                        {tx.type==='deposit'?'إيداع':tx.type==='withdraw'?'سحب':tx.type==='buy'?'شراء':tx.type==='sell'?'بيع':'تحويل'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 16px', fontSize:'0.8rem', color:'#1E293B', borderBottom:'1px solid rgba(203,213,225,0.6)', fontFamily:'monospace', fontWeight:700 }}>{fmtAmount(tx.amount)}</td>
                    <td style={{ padding:'10px 16px', fontSize:'0.75rem', color:'#64748B', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>{tx.currency || 'SAR'}</td>
                    <td style={{ padding:'10px 16px', borderBottom:'1px solid rgba(203,213,225,0.6)' }}>
                      <span style={{ padding:'3px 9px', borderRadius:20, fontSize:'0.68rem', fontWeight:600,
                        background: tx.status==='completed'?'rgba(0,217,126,0.1)':tx.status==='rejected'?'rgba(255,69,96,0.1)':'rgba(245,158,11,0.1)',
                        color: tx.status==='completed'?'#00D97E':tx.status==='rejected'?'#FF4560':'#F59E0B' }}>
                        {tx.status==='completed'?'مكتمل':tx.status==='rejected'?'مرفوض':'معلق'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 16px', fontSize:'0.7rem', color:'#64748B', borderBottom:'1px solid rgba(203,213,225,0.6)', whiteSpace:'nowrap' }}>{fmtDate(tx.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
