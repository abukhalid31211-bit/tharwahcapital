import { useState } from 'react'
import { Search, Plus, ChevronDown } from 'lucide-react'
import { mockTransactions } from '../adminData'

const s = {
  card: { background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  th: { padding: '14px 16px', textAlign: 'right' as const, fontSize: '0.75rem', fontWeight: 600, color: '#6B84A8', letterSpacing: '0.5px', borderBottom: '1px solid #1A2E4A', background: '#060E1A', whiteSpace: 'nowrap' as const },
  td: { padding: '14px 16px', fontSize: '0.875rem', color: '#E2E8F4', borderBottom: '1px solid rgba(26,46,74,0.5)' },
}

export default function Transactions() {
  const [showModal, setShowModal] = useState(false)
  const [txType, setTxType] = useState<'buy' | 'sell' | 'transfer'>('buy')
  const [qty, setQty] = useState('')
  const [price, setPrice] = useState('')
  const [search, setSearch] = useState('')

  const total = parseFloat(qty || '0') * parseFloat(price || '0')

  const summaryCards = [
    { label: 'صفقات اليوم', value: '34', sub: 'صفقة', icon: '⚡', color: '#C9A84C' },
    { label: 'هذا الشهر', value: '234', sub: 'صفقة', icon: '📅', color: '#3B82F6' },
    { label: 'إجمالي الحجم', value: '$18.4M', sub: 'هذا الشهر', icon: '💰', color: '#00D97E' },
    { label: 'صفقات معلقة', value: '7', sub: 'تحتاج موافقة', icon: '⏳', color: '#F59E0B' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>العمليات والصفقات</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8', marginTop: 4 }}>إجمالي {mockTransactions.length} عملية مسجلة</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
          <Plus size={16} /> إضافة عملية
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {summaryCards.map((c, i) => (
          <div key={i} style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.78rem', color: '#6B84A8', fontWeight: 600 }}>{c.label}</span>
              <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: c.color, fontFamily: 'monospace', lineHeight: 1, marginBottom: 4 }}>{c.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B84A8' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...s.card }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A2E4A', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, padding: '8px 14px', flex: 1 }}>
            <Search size={15} color="#6B84A8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
              style={{ background: 'none', border: 'none', outline: 'none', color: '#E2E8F4', fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", width: '100%' }} />
          </div>
          {['النوع', 'الأصل', 'العميل', 'التاريخ'].map(f => (
            <button key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
              {f} <ChevronDown size={13} />
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', 'النوع', 'العميل', 'الأصل', 'الكمية', 'السعر', 'الإجمالي', 'التاريخ', 'الحالة'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTransactions.filter(t => !search || t.client.includes(search) || t.asset.includes(search)).map(t => (
                <tr key={t.id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={s.td}><span style={{ fontFamily: 'monospace', color: '#6B84A8', fontSize: '0.8rem' }}>#{t.id}</span></td>
                  <td style={s.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, background: t.type === 'buy' ? 'rgba(0,217,126,0.1)' : t.type === 'sell' ? 'rgba(255,69,96,0.1)' : 'rgba(59,130,246,0.1)', color: t.type === 'buy' ? '#00D97E' : t.type === 'sell' ? '#FF4560' : '#3B82F6' }}>
                      {t.type === 'buy' ? '🟢 شراء' : t.type === 'sell' ? '🔴 بيع' : '↔ تحويل'}
                    </span>
                  </td>
                  <td style={s.td}>{t.client}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{t.asset}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace' }}>{t.qty}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace' }}>${t.price.toLocaleString()}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', color: '#C9A84C', fontWeight: 600 }}>${t.total.toLocaleString()}</td>
                  <td style={{ ...s.td, fontSize: '0.78rem', color: '#6B84A8' }}>{t.date}</td>
                  <td style={s.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 600, color: t.status === 'completed' ? '#00D97E' : '#F59E0B' }}>
                      {t.status === 'completed' ? '✅ مكتمل' : '⏳ معلق'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 20, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F4' }}>إضافة عملية جديدة</span>
              <button onClick={() => setShowModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #1A2E4A', background: 'transparent', color: '#6B84A8', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Type Toggle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 8 }}>نوع العملية *</label>
                <div style={{ display: 'flex', gap: 0, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 10, padding: 4 }}>
                  {[{ key: 'buy', label: '🟢 شراء' }, { key: 'sell', label: '🔴 بيع' }, { key: 'transfer', label: '↔ تحويل' }].map(t => (
                    <button key={t.key} onClick={() => setTxType(t.key as typeof txType)}
                      style={{ flex: 1, padding: '10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s', background: txType === t.key ? (t.key === 'buy' ? 'rgba(0,217,126,0.15)' : t.key === 'sell' ? 'rgba(255,69,96,0.15)' : 'rgba(59,130,246,0.15)') : 'transparent', color: txType === t.key ? (t.key === 'buy' ? '#00D97E' : t.key === 'sell' ? '#FF4560' : '#3B82F6') : '#6B84A8' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              {[{ label: 'العميل *', placeholder: 'ابحث عن العميل...' }, { label: 'الأصل *', placeholder: 'رمز الأصل (مثال: ARAMCO)' }].map((f, i) => (
                <div key={i}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>{f.label}</label>
                  <input placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#1A2E4A'} />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>الكمية *</label>
                  <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#1A2E4A'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>سعر الوحدة *</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#1A2E4A'} />
                </div>
              </div>

              {/* Auto Total */}
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: '0.78rem', color: '#6B84A8', marginBottom: 4 }}>الإجمالي التلقائي</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#C9A84C', fontFamily: 'monospace' }}>
                  ${total > 0 ? total.toLocaleString('en', { minimumFractionDigits: 2 }) : '0.00'}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #1A2E4A', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>إلغاء</button>
              <button style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>✅ حفظ العملية</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
