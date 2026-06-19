import { useState } from 'react'
import { mockNotifications } from '../adminData'

const typeColors: Record<string, string> = {
  critical: '#FF4560', warning: '#F59E0B', info: '#3B82F6', success: '#00D97E',
}

export default function Notifications() {
  const [notifs, setNotifs] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markRead = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  const filtered = notifs.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const unreadCount = notifs.filter(n => !n.read).length

  const tabs = [
    { key: 'all', label: `الكل ${notifs.length}` },
    { key: 'unread', label: `غير مقروء ${unreadCount}` },
    { key: 'critical', label: 'تنبيهات' },
    { key: 'info', label: 'إشعارات' },
    { key: 'success', label: 'نجاح' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>مركز الإشعارات</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8', marginTop: 4 }}>{unreadCount} إشعار غير مقروء</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={markAllRead} style={{ padding: '9px 18px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontSize: '0.875rem' }}>
            تعليم الكل مقروء
          </button>
          <button style={{ width: 38, height: 38, background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, cursor: 'pointer', color: '#6B84A8', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1A2E4A', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{ padding: '10px 16px', background: 'none', border: 'none', color: filter === t.key ? '#C9A84C' : '#6B84A8', fontWeight: filter === t.key ? 700 : 400, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontSize: '0.82rem', borderBottom: filter === t.key ? '2px solid #C9A84C' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Today's Notifications */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B84A8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>اليوم</div>
        <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' }}>
          {filtered.filter((_, i) => i < 4).map((n, i, arr) => (
            <div key={n.id} onClick={() => markRead(n.id)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid rgba(26,46,74,0.5)' : 'none', cursor: 'pointer', background: !n.read ? 'rgba(201,168,76,0.03)' : 'transparent', transition: 'background 0.15s', position: 'relative' }}>
              {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A84C', position: 'absolute', top: 20, right: 12, flexShrink: 0 }} />}

              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${typeColors[n.type]}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                {n.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: !n.read ? 700 : 600, color: '#E2E8F4' }}>{n.title}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6B84A8', fontFamily: 'monospace', flexShrink: 0, marginRight: 12 }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6B84A8', margin: 0, marginBottom: n.actions.length > 0 ? 8 : 0 }}>{n.desc}</p>
                {n.actions.length > 0 && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    {n.actions.map((a, ai) => (
                      <button key={ai} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Cairo', sans-serif', transition: 'all 0.2s", borderColor: ai === 0 ? 'rgba(201,168,76,0.4)' : 'rgba(255,69,96,0.3)', color: ai === 0 ? '#C9A84C' : '#FF4560', background: ai === 0 ? 'rgba(201,168,76,0.08)' : 'rgba(255,69,96,0.06)' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yesterday */}
      {filtered.length > 4 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B84A8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>أمس</div>
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' }}>
            {filtered.slice(4).map((n, i, arr) => (
              <div key={n.id}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid rgba(26,46,74,0.5)' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${typeColors[n.type]}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, opacity: 0.7 }}>
                  {n.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#A0AEC0' }}>{n.title}</span>
                    <span style={{ fontSize: '0.72rem', color: '#6B84A8', fontFamily: 'monospace' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#6B84A8', margin: 0 }}>{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16, opacity: 0.5 }}>🔔</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 8 }}>لا توجد إشعارات</div>
          <div style={{ fontSize: '0.875rem', color: '#6B84A8' }}>جميع الإشعارات ستظهر هنا</div>
        </div>
      )}
    </div>
  )
}
