import { useState } from 'react'
import { Search, Send, Paperclip, X, Filter } from 'lucide-react'
import { mockMessages } from '../adminData'

export default function Messages() {
  const [activeConv, setActiveConv] = useState(mockMessages[0])
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState(mockMessages)
  const [search, setSearch] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [bulkMsg, setBulkMsg] = useState('')

  const sendMsg = () => {
    if (!input.trim()) return
    const updated = msgs.map(c =>
      c.id === activeConv.id
        ? { ...c, messages: [...c.messages, { id: c.messages.length+1, from:'admin', text:input, time:new Date().toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}) }], unread:0 }
        : c
    )
    setMsgs(updated)
    const curr = updated.find(c=>c.id===activeConv.id)!
    setActiveConv(curr)
    setInput('')
  }

  const filtered = msgs.filter(c => !search || c.client.includes(search) || c.preview.includes(search))
  const totalUnread = msgs.reduce((s,c)=>s+c.unread,0)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#E2E8F4',margin:0}}>نظام المراسلات</h1>
          <p style={{fontSize:'0.78rem',color:'#6B84A8',marginTop:3}}>{msgs.length} محادثة — {totalUnread} غير مقروء</p>
        </div>
        <button onClick={()=>setShowBulk(!showBulk)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background: showBulk ? 'rgba(201,168,76,0.15)' : 'transparent',border:`1px solid ${showBulk ? 'rgba(201,168,76,0.3)' : '#1A2E4A'}`,borderRadius:8,color: showBulk ? '#C9A84C' : '#6B84A8',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>
          📢 رسالة جماعية
        </button>
      </div>

      {/* Bulk Message */}
      {showBulk && (
        <div style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:12,padding:16}}>
          <div style={{fontSize:'0.82rem',fontWeight:700,color:'#C9A84C',marginBottom:10}}>📢 إرسال رسالة جماعية لكل العملاء</div>
          <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
            <textarea value={bulkMsg} onChange={e=>setBulkMsg(e.target.value)} placeholder="اكتب رسالتك هنا..." rows={2}
              style={{flex:1,padding:'10px 12px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",resize:'none',outline:'none'}}/>
            <button style={{padding:'10px 20px',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,color:'#060E1A',fontWeight:700,cursor:'pointer',fontFamily:"'Cairo',sans-serif",fontSize:'0.82rem',whiteSpace:'nowrap'}}>إرسال للكل</button>
          </div>
        </div>
      )}

      {/* Chat Layout */}
      <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:0,background:'#0C1A2E',border:'1px solid #1A2E4A',borderRadius:14,overflow:'hidden',height:560}}>
        {/* Conversation List */}
        <div style={{borderLeft:'1px solid #1A2E4A',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'12px 14px',borderBottom:'1px solid #1A2E4A'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,padding:'7px 10px'}}>
              <Search size={13} color="#6B84A8"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{background:'none',border:'none',outline:'none',color:'#E2E8F4',fontSize:'0.75rem',fontFamily:"'Cairo',sans-serif",flex:1,minWidth:0}}/>
            </div>
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {filtered.map(c => (
              <div key={c.id} onClick={()=>setActiveConv(c)}
                style={{padding:'12px 14px',borderBottom:'1px solid rgba(26,46,74,0.4)',cursor:'pointer',background: activeConv.id===c.id ? 'rgba(201,168,76,0.08)' : 'transparent',borderRight: activeConv.id===c.id ? '2px solid #C9A84C' : '2px solid transparent',transition:'all 0.15s'}}
                onMouseEnter={e=>{if(activeConv.id!==c.id)e.currentTarget.style.background='rgba(201,168,76,0.03)'}}
                onMouseLeave={e=>{if(activeConv.id!==c.id)e.currentTarget.style.background='transparent'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1A2E4A,#0A1628)',border:'1px solid #1A2E4A',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700,color:'#C9A84C'}}>
                      {c.client.charAt(0)}
                    </div>
                    {c.online && <div style={{position:'absolute',bottom:0,right:0,width:8,height:8,borderRadius:'50%',background:'#00D97E',border:'2px solid #0C1A2E'}}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:'0.78rem',fontWeight:600,color:'#E2E8F4'}}>{c.client}</span>
                      <span style={{fontSize:'0.62rem',color:'#4A6080',flexShrink:0}}>{c.time}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:2}}>
                      <span style={{fontSize:'0.7rem',color:'#6B84A8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{c.preview}</span>
                      {c.unread > 0 && <span style={{background:'#FF4560',color:'white',borderRadius:10,padding:'1px 6px',fontSize:'0.6rem',fontWeight:700,flexShrink:0,marginRight:4}}>{c.unread}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{display:'flex',flexDirection:'column'}}>
          {/* Header */}
          <div style={{padding:'12px 16px',borderBottom:'1px solid #1A2E4A',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{position:'relative'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#C9A84C,#E8C96A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700,color:'#060E1A'}}>{activeConv.client.charAt(0)}</div>
                {activeConv.online && <div style={{position:'absolute',bottom:0,right:0,width:8,height:8,borderRadius:'50%',background:'#00D97E',border:'2px solid #0C1A2E'}}/>}
              </div>
              <div>
                <div style={{fontSize:'0.85rem',fontWeight:700,color:'#E2E8F4'}}>{activeConv.client}</div>
                <div style={{fontSize:'0.65rem',color: activeConv.online ? '#00D97E' : '#6B84A8'}}>{activeConv.online ? '● متصل الآن' : 'غير متصل'}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button style={{padding:'5px 10px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:7,color:'#3B82F6',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>📊 محفظته</button>
              <button style={{padding:'5px 10px',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:7,color:'#C9A84C',fontSize:'0.7rem',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>👤 ملفه</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:12}}>
            {activeConv.messages.map(m => (
              <div key={m.id} style={{display:'flex',justifyContent: m.from==='admin' ? 'flex-start' : 'flex-end'}}>
                <div style={{maxWidth:'70%',padding:'10px 14px',borderRadius: m.from==='admin' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',background: m.from==='admin' ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : '#111E33',color: m.from==='admin' ? '#060E1A' : '#E2E8F4',fontSize:'0.82rem',lineHeight:1.5}}>
                  {m.text}
                  <div style={{fontSize:'0.6rem',color: m.from==='admin' ? 'rgba(6,14,26,0.6)' : '#4A6080',marginTop:4,textAlign:'left'}}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{padding:'12px 16px',borderTop:'1px solid #1A2E4A',display:'flex',gap:8,alignItems:'flex-end'}}>
            <button style={{width:34,height:34,background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#6B84A8',flexShrink:0}}>
              <Paperclip size={14}/>
            </button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}}} placeholder="اكتب رسالتك..."
              style={{flex:1,padding:'9px 14px',background:'#060E1A',border:'1px solid #1A2E4A',borderRadius:8,color:'#E2E8F4',fontSize:'0.82rem',fontFamily:"'Cairo',sans-serif",outline:'none'}}
              onFocus={e=>e.target.style.borderColor='#C9A84C'}
              onBlur={e=>e.target.style.borderColor='#1A2E4A'}/>
            <button onClick={sendMsg} style={{width:34,height:34,background:'linear-gradient(135deg,#C9A84C,#E8C96A)',border:'none',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
              <Send size={14} color="#060E1A"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
