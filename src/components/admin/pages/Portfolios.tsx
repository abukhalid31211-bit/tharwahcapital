import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts'
import { mockPortfolios } from '../adminData'

const assetColors: Record<string,string> = { stocks:'#3B82F6', crypto:'#F59E0B', metals:'#9CA3AF', oil:'#EF4444' }
const assetLabels: Record<string,string> = { stocks:'أسهم', crypto:'رقمي', metals:'معادن', oil:'نفط' }

const perf = [
  {month:'أكتوبر',value:95},{month:'نوفمبر',value:102},{month:'ديسمبر',value:98},{month:'يناير',value:112},
]

export default function Portfolios() {
  const [expanded, setExpanded] = useState<number|null>(null)
  const [viewMode, setViewMode] = useState<'grid'|'table'>('grid')

  const totalAUM = mockPortfolios.reduce((s,p)=>s+p.total,0)

  const summaryCards = [
    {label:'إجمالي المحافظ',value:mockPortfolios.length.toString(),icon:'📁',color:'#3B82F6'},
    {label:'إجمالي AUM',value:'$' + (totalAUM/1000).toFixed(0)+'K',icon:'💰',color:'#C9A84C'},
    {label:'متوسط العائد',value:'+19.4%',icon:'📈',color:'#00D97E'},
    {label:'أعلى أداء',value:mockPortfolios.sort((a,b)=>b.return-a.return)[0]?.clientName.split(' ')[0]||'',icon:'🏆',color:'#F59E0B'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#E2E8F4',margin:0}}>المحافظ الاستثمارية</h1>
          <p style={{fontSize:'0.78rem',color:'#6B84A8',marginTop:3}}>{mockPortfolios.length} محفظة — إجمالي AUM: ${(totalAUM/1000).toFixed(0)}K</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          {[{k:'grid',l:'بطاقات'},{k:'table',l:'جدول'}].map(m=>(
            <button key={m.k} onClick={()=>setViewMode(m.k as any)} style={{padding:'7px 14px',background: viewMode===m.k ? 'rgba(201,168,76,0.15)' : 'transparent',border:`1px solid ${viewMode===m.k ? 'rgba(201,168,76,0.3)' : '#1A2E4A'}`,borderRadius:8,color: viewMode===m.k ? '#C9A84C' : '#6B84A8',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{m.l}</button>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {summaryCards.map((s,i)=>(
          <div key={i} style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:'0.68rem',color:'#6B84A8',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.3rem',fontWeight:800,color:s.color,fontFamily:'monospace'}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      <div style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:14,padding:20}}>
        <div style={{fontSize:'0.875rem',fontWeight:700,color:'#E2E8F4',marginBottom:14}}>ترتيب الأداء</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {mockPortfolios.sort((a,b)=>b.return-a.return).map((p,i)=>(
            <div key={p.clientId} style={{display:'flex',alignItems:'center',gap:14,padding:'10px 14px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:10}}>
              <span style={{fontSize:'1.1rem',flexShrink:0}}>{i===0?'🥇':i===1?'🥈':'🥉'}</span>
              <span style={{fontSize:'0.85rem',fontWeight:600,color:'#E2E8F4',flex:1}}>{p.clientName}</span>
              <span style={{fontSize:'0.78rem',color:'#6B84A8',fontFamily:'monospace'}}>AUM: ${p.total.toLocaleString()}</span>
              <span style={{fontSize:'0.85rem',fontWeight:700,color:'#00D97E',fontFamily:'monospace'}}>+{p.return}%</span>
              <div style={{width:100,height:6,background:'#1A2E4A',borderRadius:3}}>
                <div style={{height:'100%',width:`${(p.return/25)*100}%`,background:'linear-gradient(90deg,#00D97E,#00B87E)',borderRadius:3}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {mockPortfolios.map(p=>(
          <div key={p.clientId} style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:14,overflow:'hidden'}}>
            <div style={{padding:'14px 16px',borderBottom:'1px solid #1A2E4A',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',fontWeight:700,color:'#060E1A',flexShrink:0}}>{p.clientName.charAt(0)}</div>
                <div>
                  <div style={{fontSize:'0.82rem',fontWeight:700,color:'#E2E8F4'}}>{p.clientName}</div>
                  <div style={{fontSize:'0.65rem',color:'#6B84A8'}}>{p.advisor}</div>
                </div>
              </div>
              <span style={{fontSize:'0.78rem',fontWeight:700,color:'#00D97E'}}>+{p.return}%</span>
            </div>
            <div style={{padding:'14px 16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <span style={{fontSize:'0.72rem',color:'#6B84A8'}}>إجمالي المحفظة</span>
                <span style={{fontSize:'1rem',fontWeight:800,color:'#C9A84C',fontFamily:'monospace'}}>${p.total.toLocaleString()}</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {p.assets.map((a,ai)=>(
                  <div key={ai} style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:assetColors[a.type]||'#6B84A8',flexShrink:0}}/>
                    <span style={{fontSize:'0.72rem',color:'#E2E8F4',flex:1}}>{a.name}</span>
                    <span style={{fontSize:'0.7rem',color:'#6B84A8',fontFamily:'monospace'}}>${a.value.toLocaleString()}</span>
                    <span style={{fontSize:'0.68rem',fontWeight:600,color: a.change>=0 ? '#00D97E' : '#FF4560',fontFamily:'monospace'}}>{a.change>=0?'+':''}{a.change}%</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:12,height:6,background:'#1A2E4A',borderRadius:3,overflow:'hidden',display:'flex'}}>
                {p.assets.map((a,ai)=>(
                  <div key={ai} style={{height:'100%',flex:a.value/p.total,background:assetColors[a.type]||'#6B84A8'}}/>
                ))}
              </div>
              <div style={{marginTop:10,display:'flex',gap:6}}>
                <button style={{flex:1,padding:'7px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:7,color:'#3B82F6',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>📊 تقرير</button>
                <button style={{flex:1,padding:'7px',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:7,color:'#C9A84C',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>✏️ تعديل</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
