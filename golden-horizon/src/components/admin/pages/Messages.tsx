import { useState } from 'react'
import { Search, Send, Paperclip, Smile } from 'lucide-react'
import { mockMessages } from '../adminData'

export default function Messages() {
  const [activeConv, setActiveConv] = useState(mockMessages[0])
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [filter, setFilter] = useState('all')
  const [showBulk, setShowBulk] = useState(false)

  const sendMsg = () => {
    if (!input.trim()) return
    const updated = messages.map(c =>
      c.id === activeConv.id
        ? { ...c, messages: [...c.messages, { id: c.messages.length + 1, from: 'admin', text: input, time: new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }) }], unread: 0 }
        : c
    )
    setMessages(updated)
    setActiveConv(updated.find(c => c.id === activeConv.id)!)
    setInput('')
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>نظام المراسلات</h1>
        <button onClick={() => setShowBulk(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
          📢 رسالة جماعية
        </button>
      </div>

      <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden', display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 220px)' }}>
        {/* Conversations */}
        <div style={{ borderLeft: '1px solid #1A2E4A', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 14, borderBottom: '1px solid #1A2E4A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
              <Search size={15} color="#6B84A8" />
              <input placeholder="بحث..." style={{ background: 'none', border: 'none', outline: 'none', color: '#E2E8F4', fontSize: '0.82rem', fontFamily: "'Cairo', sans-serif", width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['الكل', 'غير مقروء'].map(f => (
                <button key={f} onClick={() => setFilter(f === 'الكل' ? 'all' : 'unread')}
                  style={{ padding: '4px 12px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", border: 'none', background: filter === (f === 'الكل' ? 'all' : 'unread') ? 'rgba(201,168,76,0.12)' : 'transparent', color: filter === (f === 'الكل' ? 'all' : 'unread') ? '#C9A84C' : '#6B84A8', fontWeight: filter === (f === 'الكل' ? 'all' : 'unread') ? 600 : 400 }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {messages.filter(c => filter === 'all' || c.unread > 0).map(conv => (
              <div key={conv.id} onClick={() => setActiveConv(conv)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(26,46,74,0.4)', background: activeConv.id === conv.id ? 'rgba(201,168,76,0.08)' : 'transparent', transition: 'background 0.15s' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
                    {conv.client.charAt(0)}
                  </div>
                  {conv.online && <div style={{ width: 10, height: 10, background: '#00D97E', border: '2px solid #0C1A2E', borderRadius: '50%', position: 'absolute', bottom: 0, left: 0 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: conv.unread > 0 ? 700 : 500, color: '#E2E8F4' }}>{conv.client}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6B84A8', whiteSpace: 'nowrap' }}>{conv.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#6B84A8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{conv.preview}</span>
                    {conv.unread > 0 && <span style={{ background: '#FF4560', color: 'white', borderRadius: 10, padding: '2px 7px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginRight: 4 }}>{conv.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #1A2E4A' }}>
            <button onClick={() => setShowBulk(true)} style={{ width: '100%', padding: '10px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: '#C9A84C', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              + رسالة جماعية
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #1A2E4A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#C9A84C' }}>{activeConv.client.charAt(0)}</div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E2E8F4' }}>{activeConv.client}</div>
                <div style={{ fontSize: '0.72rem', color: activeConv.online ? '#00D97E' : '#6B84A8' }}>{activeConv.online ? '🟢 متصل الآن' : '⚫ غير متصل'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['📞', '📊', '⋮'].map(a => (
                <button key={a} style={{ width: 36, height: 36, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B84A8' }}>{a}</button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, background: '#060E1A' }}>
            {activeConv.messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'client' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '65%', padding: '10px 14px', borderRadius: msg.from === 'client' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: '0.875rem', lineHeight: 1.5, background: msg.from === 'client' ? '#0C1A2E' : 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: msg.from === 'client' ? '#E2E8F4' : '#060E1A', fontWeight: msg.from === 'admin' ? 500 : 400 }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#6B84A8', marginTop: 4, fontFamily: 'monospace' }}>
                  {msg.time} {msg.from === 'admin' && '✓✓'}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1A2E4A', display: 'flex', alignItems: 'flex-end', gap: 10, background: '#0C1A2E' }}>
            {[<Paperclip key="p" size={18} />, <Smile key="s" size={18} />].map((icon, i) => (
              <button key={i} style={{ width: 36, height: 36, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B84A8', flexShrink: 0 }}>{icon}</button>
            ))}
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
              placeholder="اكتب رسالتك..."
              rows={1}
              style={{ flex: 1, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 10, padding: '10px 14px', color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", resize: 'none', outline: 'none', direction: 'rtl', lineHeight: 1.4 }} />
            <button onClick={sendMsg} style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <Send size={16} color="#060E1A" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Message Modal */}
      {showBulk && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowBulk(false)}>
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 20, width: 600, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F4' }}>إرسال رسالة جماعية</span>
              <button onClick={() => setShowBulk(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #1A2E4A', background: 'transparent', color: '#6B84A8', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 8 }}>المستلمون *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['كل العملاء', 'عملاء محددين', 'فئة محددة'].map((o, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem', color: '#E2E8F4' }}>
                      <input type="radio" name="recipients" defaultChecked={i === 0} style={{ accentColor: '#C9A84C' }} /> {o}
                    </label>
                  ))}
                </div>
              </div>
              {['الموضوع *', ''].map((label, i) => i === 0 ? (
                <div key={i}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>{label}</label>
                  <input placeholder="موضوع الرسالة" style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ) : (
                <div key={i}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>نص الرسالة *</label>
                  <textarea rows={6} placeholder="اكتب رسالتك هنا..." style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', resize: 'vertical', boxSizing: 'border-box', direction: 'rtl' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 8 }}>طريقة الإرسال</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['داخل المنصة', 'بريد إلكتروني', 'WhatsApp'].map((m, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem', color: '#E2E8F4' }}>
                      <input type="checkbox" defaultChecked={i < 2} style={{ accentColor: '#C9A84C' }} /> {m}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowBulk(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>إلغاء</button>
              <button style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>📤 إرسال للكل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
