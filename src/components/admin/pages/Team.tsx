import { useState } from 'react'
import { Plus, X, Mail, Shield } from 'lucide-react'
import { mockTeam, roleLabels } from '../adminData'

const roleBadge: Record<string,{bg:string;color:string}> = {
  SUPER_ADMIN:{bg:'rgba(201,168,76,0.15)',color:'#C9A84C'},
  ADMIN:{bg:'rgba(59,130,246,0.1)',color:'#3B82F6'},
  ADVISOR:{bg:'rgba(245,158,11,0.1)',color:'#F59E0B'},
  CONTENT_MANAGER:{bg:'rgba(0,217,126,0.1)',color:'#00D97E'},
}

const permissions: Record<string,string[]> = {
  SUPER_ADMIN:['كل الصلاحيات','إدارة الفريق','إعدادات النظام','التقارير المالية','حذف البيانات'],
  ADMIN:['إدارة العملاء','الصفقات','المحتوى','التقارير','الرسائل'],
  ADVISOR:['عرض العملاء','إضافة صفقات','الرسائل','التقارير الخاصة'],
  CONTENT_MANAGER:['إدارة المقالات','نشر المحتوى','إدارة الأخبار'],
}

export default function Team() {
  const [showModal, setShowModal] = useState(false)
  const [viewMember, setViewMember] = useState<typeof mockTeam[0]|null>(null)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('ADVISOR')

  const stats = [
    {label:'Super Admin',count:mockTeam.filter(t=>t.role==='SUPER_ADMIN').length,icon:'👑',color:'#C9A84C'},
    {label:'مشرفون',count:mockTeam.filter(t=>t.role==='ADMIN').length,icon:'🔵',color:'#3B82F6'},
    {label:'مستشارون',count:mockTeam.filter(t=>t.role==='ADVISOR').length,icon:'🟡',color:'#F59E0B'},
    {label:'المحررون',count:mockTeam.filter(t=>t.role==='CONTENT_MANAGER').length,icon:'🟢',color:'#00D97E'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#E2E8F4',margin:0}}>إدارة الفريق</h1>
          <p style={{fontSize:'0.78rem',color:'#6B84A8',marginTop:3}}>{mockTeam.length} عضو — {mockTeam.filter(t=>t.status==='active').length} نشط</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,color:'#060E1A',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
          <Plus size={14}/> إضافة عضو
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'1.6rem'}}>{s.icon}</span>
            <div>
              <div style={{fontSize:'0.68rem',color:'#6B84A8',fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:'1.6rem',fontWeight:800,color:s.color,fontFamily:'monospace'}}>{s.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {mockTeam.map(member=>(
          <div key={member.id} style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:14,padding:20,display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${roleBadge[member.role]?.color||'#6B84A8'},${roleBadge[member.role]?.color||'#6B84A8'}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:800,color:'#060E1A',flexShrink:0}}>
                {member.name.charAt(0)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.85rem',fontWeight:700,color:'#E2E8F4'}}>{member.name}</div>
                <span style={{...roleBadge[member.role],borderRadius:20,padding:'2px 10px',fontSize:'0.65rem',fontWeight:700}}>{roleLabels[member.role]}</span>
              </div>
              <div style={{width:8,height:8,borderRadius:'50%',background: member.status==='active' ? '#00D97E' : '#6B84A8',flexShrink:0}}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem'}}>
                <span style={{color:'#6B84A8'}}>البريد</span>
                <span style={{color:'#E2E8F4'}}>{member.email}</span>
              </div>
              {member.clients > 0 && (
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem'}}>
                  <span style={{color:'#6B84A8'}}>عدد العملاء</span>
                  <span style={{color:'#C9A84C',fontWeight:700,fontFamily:'monospace'}}>{member.clients}</span>
                </div>
              )}
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem'}}>
                <span style={{color:'#6B84A8'}}>آخر نشاط</span>
                <span style={{color:'#E2E8F4'}}>{member.lastActive}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem'}}>
                <span style={{color:'#6B84A8'}}>انضم في</span>
                <span style={{color:'#E2E8F4'}}>{member.joined}</span>
              </div>
            </div>
            <div style={{borderTop:'1px solid #1A2E4A',paddingTop:12}}>
              <div style={{fontSize:'0.65rem',color:'#6B84A8',fontWeight:600,marginBottom:6}}>الصلاحيات</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {(permissions[member.role]||[]).slice(0,3).map(p=>(
                  <span key={p} style={{fontSize:'0.6rem',color:'#E2E8F4',background:'rgba(26,46,74,0.6)',borderRadius:4,padding:'2px 6px'}}>{p}</span>
                ))}
                {permissions[member.role]?.length > 3 && <span style={{fontSize:'0.6rem',color:'#6B84A8',padding:'2px 4px'}}>+{permissions[member.role].length-3}</span>}
              </div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>setViewMember(member)} style={{flex:1,padding:'7px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:7,color:'#3B82F6',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>عرض</button>
              {member.role !== 'SUPER_ADMIN' && (
                <button style={{flex:1,padding:'7px',background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:7,color:'#FF4560',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>تعطيل</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div style={{background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:14,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid #1A2E4A',display:'flex',alignItems:'center',gap:8}}>
          <Shield size={16} color="#C9A84C"/>
          <span style={{fontSize:'0.875rem',fontWeight:700,color:'#E2E8F4'}}>مصفوفة الصلاحيات</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
            <thead>
              <tr>
                <th style={{padding:'10px 16px',textAlign:'right',fontSize:'0.7rem',color:'#6B84A8',borderBottom:'1px solid #1A2E4A',background:'#060E1A',fontWeight:600}}>الصلاحية</th>
                {['Super Admin','Admin','Advisor','Content Manager'].map(r=>(
                  <th key={r} style={{padding:'10px 16px',textAlign:'center',fontSize:'0.7rem',color:'#6B84A8',borderBottom:'1px solid #1A2E4A',background:'#060E1A',fontWeight:600,whiteSpace:'nowrap'}}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['إدارة العملاء','✅','✅','👁️','✖️'],['الصفقات','✅','✅','✅','✖️'],['التقارير المالية','✅','✅','✖️','✖️'],['إدارة المحتوى','✅','✅','✖️','✅'],['إعدادات النظام','✅','✖️','✖️','✖️'],['إدارة الفريق','✅','✖️','✖️','✖️']].map((row,i)=>(
                <tr key={i} onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'10px 16px',fontSize:'0.78rem',color:'#E2E8F4',borderBottom:'1px solid rgba(26,46,74,0.4)',fontWeight:600}}>{row[0]}</td>
                  {row.slice(1).map((v,j)=>(
                    <td key={j} style={{padding:'10px 16px',textAlign:'center',fontSize:'0.9rem',borderBottom:'1px solid rgba(26,46,74,0.4)'}}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(6,14,26,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setShowModal(false)}>
          <div style={{background:'#0A1628',border:'1px solid #1A2E4A',borderRadius:16,width:480}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #1A2E4A',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,color:'#E2E8F4'}}>إضافة عضو جديد</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#6B84A8',display:'flex'}}><X size={18}/></button>
            </div>
            <div style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
              {[{label:'الاسم الكامل',value:newName,set:setNewName,placeholder:'أحمد محمد'},{label:'البريد الإلكتروني',value:newEmail,set:setNewEmail,placeholder:'ahmed@company.com'}].map(f=>(
                <div key={f.label}>
                  <div style={{fontSize:'0.72rem',color:'#6B84A8',fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <input value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={{width:'100%',padding:'10px 12px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",boxSizing:'border-box',outline:'none'}} onFocus={e=>e.target.style.borderColor='#C9A84C'} onBlur={e=>e.target.style.borderColor='#1A2E4A'}/>
                </div>
              ))}
              <div>
                <div style={{fontSize:'0.72rem',color:'#6B84A8',fontWeight:600,marginBottom:6}}>الدور</div>
                <select value={newRole} onChange={e=>setNewRole(e.target.value)} style={{width:'100%',padding:'10px 12px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}>
                  {Object.entries(roleLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <button style={{width:'100%',padding:'11px',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,color:'#060E1A',fontWeight:800,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.85rem'}}>إضافة العضو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
