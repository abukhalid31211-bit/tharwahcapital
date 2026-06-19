import { useState } from 'react'
import { Plus, Eye, Edit, Trash2, X, Bold, Italic, Link } from 'lucide-react'
import { mockArticles } from '../adminData'

const statusBadge = (s:string) => ({published:{bg:'rgba(0,217,126,0.1)',color:'#00D97E',label:'🟢 منشور'},draft:{bg:'rgba(245,158,11,0.1)',color:'#F59E0B',label:'🟡 مسودة'}}[s]||{bg:'rgba(107,132,168,0.15)',color:'#6B84A8',label:'⚪ أرشيف'})

const categories = ['تحليل','أسهم','رقمي','معادن','فوركس','اقتصاد']

export default function Content() {
  const [tab, setTab] = useState('articles')
  const [showEditor, setShowEditor] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [cat, setCat] = useState('تحليل')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockArticles.filter(a => statusFilter==='all' || a.status===statusFilter)
  const stats = [
    {label:'إجمالي المقالات',value:mockArticles.length,icon:'📰',color:'#3B82F6'},
    {label:'منشور',value:mockArticles.filter(a=>a.status==='published').length,icon:'🟢',color:'#00D97E'},
    {label:'مسودة',value:mockArticles.filter(a=>a.status==='draft').length,icon:'🟡',color:'#F59E0B'},
    {label:'إجمالي المشاهدات',value:mockArticles.reduce((s,a)=>s+a.views,0).toLocaleString(),icon:'👁️',color:'#C9A84C'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#E2E8F4',margin:0}}>إدارة المحتوى</h1>
          <p style={{fontSize:'0.78rem',color:'#6B84A8',marginTop:3}}>المقالات والأخبار والإعلانات</p>
        </div>
        <button onClick={()=>setShowEditor(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,color:'#060E1A',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
          <Plus size={14}/> مقال جديد
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'1.5rem'}}>{s.icon}</span>
            <div>
              <div style={{fontSize:'0.68rem',color:'#6B84A8',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.4rem',fontWeight:800,color:s.color,fontFamily:'monospace'}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:10,padding:4,width:'fit-content'}}>
        {[{k:'articles',l:'المقالات'},{k:'news',l:'الأخبار'},{k:'announcements',l:'الإعلانات'},{k:'media',l:'مكتبة الوسائط'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:'7px 16px',background: tab===t.k ? '#060E1A' : 'transparent',border:'none',borderRadius:7,color: tab===t.k ? '#E2E8F4' : '#6B84A8',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontWeight: tab===t.k ? 600 : 400}}>{t.l}</button>
        ))}
      </div>

      {(tab==='articles'||tab==='news') && (
        <div style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:14,overflow:'hidden'}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #1A2E4A',display:'flex',gap:6}}>
            {[{k:'all',l:'الكل'},{k:'published',l:'منشور'},{k:'draft',l:'مسودة'}].map(t=>(
              <button key={t.k} onClick={()=>setStatusFilter(t.k)} style={{padding:'5px 12px',background: statusFilter===t.k ? '#060E1A' : 'transparent',border:`1px solid ${statusFilter===t.k ? '#1A2E4A' : 'transparent'}`,borderRadius:7,color: statusFilter===t.k ? '#E2E8F4' : '#6B84A8',fontSize:'0.72rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{t.l}</button>
            ))}
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
              <thead>
                <tr>{['العنوان','التصنيف','الكاتب','المشاهدات','التعليقات','الحالة','التاريخ','إجراءات'].map(h=>(
                  <th key={h} style={{padding:'10px 14px',textAlign:'right',fontSize:'0.7rem',fontWeight:600,color:'#6B84A8',borderBottom:'1px solid #1A2E4A',background:'#060E1A',whiteSpace:'nowrap'}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(a=>(
                  <tr key={a.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'12px 14px',fontSize:'0.8rem',color:'#E2E8F4',borderBottom:'1px solid rgba(26,46,74,0.4)',fontWeight:600,maxWidth:220}}>{a.title}</td>
                    <td style={{padding:'12px 14px',borderBottom:'1px solid rgba(26,46,74,0.4)'}}>
                      <span style={{background:'rgba(59,130,246,0.1)',color:'#3B82F6',borderRadius:6,padding:'3px 9px',fontSize:'0.68rem',fontWeight:600}}>{a.category}</span>
                    </td>
                    <td style={{padding:'12px 14px',fontSize:'0.78rem',color:'#E2E8F4',borderBottom:'1px solid rgba(26,46,74,0.4)'}}>{a.author}</td>
                    <td style={{padding:'12px 14px',fontSize:'0.78rem',color:'#C9A84C',borderBottom:'1px solid rgba(26,46,74,0.4)',fontFamily:'monospace'}}>{a.views.toLocaleString()}</td>
                    <td style={{padding:'12px 14px',fontSize:'0.78rem',color:'#6B84A8',borderBottom:'1px solid rgba(26,46,74,0.4)',fontFamily:'monospace'}}>{a.comments}</td>
                    <td style={{padding:'12px 14px',borderBottom:'1px solid rgba(26,46,74,0.4)'}}>
                      <span style={{...statusBadge(a.status),borderRadius:20,padding:'3px 9px',fontSize:'0.68rem',fontWeight:600}}>{statusBadge(a.status).label}</span>
                    </td>
                    <td style={{padding:'12px 14px',fontSize:'0.7rem',color:'#6B84A8',borderBottom:'1px solid rgba(26,46,74,0.4)',whiteSpace:'nowrap'}}>{a.date}</td>
                    <td style={{padding:'12px 14px',borderBottom:'1px solid rgba(26,46,74,0.4)'}}>
                      <div style={{display:'flex',gap:4}}>
                        <button style={{width:28,height:28,background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#3B82F6'}}><Eye size={12}/></button>
                        <button style={{width:28,height:28,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#C9A84C'}}><Edit size={12}/></button>
                        <button style={{width:28,height:28,background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF4560'}}><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='media' && (
        <div style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:14,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <span style={{fontSize:'0.875rem',fontWeight:700,color:'#E2E8F4'}}>مكتبة الوسائط</span>
            <button style={{padding:'7px 14px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:7,color:'#3B82F6',fontSize:'0.75rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>📤 رفع ملف</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10}}>
            {Array.from({length:12},(_,i)=>(
              <div key={i} style={{background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,aspectRatio:'1',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,cursor:'pointer',fontSize:'1.8rem'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#C9A84C'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='#1A2E4A'}>
                {['🖼️','📄','📊','🎬'][i%4]}
                <span style={{fontSize:'0.6rem',color:'#4A6080'}}>img_{i+1}.png</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='announcements' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[
            {title:'تحديث شروط الخدمة',date:'2025-01-08',status:'نشط',icon:'📋'},
            {title:'صيانة مجدولة - الجمعة 2 صباحاً',date:'2025-01-10',status:'قادم',icon:'🔧'},
            {title:'إطلاق ميزة التقارير التلقائية',date:'2025-01-05',status:'مؤرشف',icon:'🚀'},
          ].map((a,i)=>(
            <div key={i} style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
              <span style={{fontSize:'1.5rem'}}>{a.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.85rem',fontWeight:700,color:'#E2E8F4'}}>{a.title}</div>
                <div style={{fontSize:'0.7rem',color:'#6B84A8',marginTop:3}}>تاريخ النشر: {a.date}</div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:20,fontSize:'0.7rem',fontWeight:700,background: a.status==='نشط'?'rgba(0,217,126,0.1)':a.status==='قادم'?'rgba(59,130,246,0.1)':'rgba(107,132,168,0.1)',color: a.status==='نشط'?'#00D97E':a.status==='قادم'?'#3B82F6':'#6B84A8'}}>{a.status}</span>
              <div style={{display:'flex',gap:4}}>
                <button style={{width:28,height:28,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#C9A84C'}}><Edit size={12}/></button>
                <button style={{width:28,height:28,background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#FF4560'}}><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div style={{position:'fixed',inset:0,background:'rgba(6,14,26,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={()=>setShowEditor(false)}>
          <div style={{background:'#0A1628',border:'1px solid #1A2E4A',borderRadius:16,width:'100%',maxWidth:720,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #1A2E4A',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:'#E2E8F4'}}>محرر المقالات</span>
              <button onClick={()=>setShowEditor(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#6B84A8',display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان المقال..." style={{width:'100%',padding:'12px 14px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'1rem',fontWeight:700,fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}} onFocus={e=>e.target.style.borderColor='#C9A84C'} onBlur={e=>e.target.style.borderColor='#1A2E4A'}/>
              <div style={{display:'flex',gap:8}}>
                <select value={cat} onChange={e=>setCat(e.target.value)} style={{padding:'9px 12px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}>
                  {categories.map(c=><option key={c}>{c}</option>)}
                </select>
                <select style={{padding:'9px 12px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}>
                  <option>منشور</option><option>مسودة</option>
                </select>
              </div>
              <div style={{background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,overflow:'hidden'}}>
                <div style={{padding:'8px 12px',borderBottom:'1px solid #1A2E4A',display:'flex',gap:6}}>
                  {[{Icon:Bold,label:'B'},{Icon:Italic,label:'I'},{Icon:Link,label:'L'}].map(({Icon,label})=>(
                    <button key={label} style={{width:28,height:28,background:'#1A2E4A',border:'none',borderRadius:5,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#E2E8F4'}}><Icon size={13}/></button>
                  ))}
                </div>
                <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="اكتب محتوى المقال هنا..." rows={10}
                  style={{width:'100%',padding:'14px',background:'none',border:'none',color:'#E2E8F4',fontSize:'0.85rem',fontFamily:"'Cairo',sans-serif",resize:'vertical',outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button style={{flex:1,padding:'11px',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,color:'#060E1A',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>🚀 نشر الآن</button>
                <button style={{flex:1,padding:'11px',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:8,color:'#F59E0B',cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>💾 حفظ كمسودة</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
