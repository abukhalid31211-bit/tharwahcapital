import { useState, useEffect } from 'react'
import { UserPlus, Trash2, Eye, EyeOff, Shield, Mail, Lock, Copy, CheckCircle, AlertTriangle, Users } from 'lucide-react'

export interface SubAdmin {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  status: 'active' | 'inactive'
}

const STORAGE_KEY = 'tharwah_sub_admins'

export function getSubAdmins(): SubAdmin[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveSubAdmins(list: SubAdmin[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export default function SubAdmins() {
  const [list, setList] = useState<SubAdmin[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [visiblePassId, setVisiblePassId] = useState<string | null>(null)

  useEffect(() => {
    setList(getSubAdmins())
  }, [])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setShowPass(false)
    setError('')
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('جميع الحقول مطلوبة')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('البريد الإلكتروني غير صحيح')
      return
    }
    if (password.length < 4) {
      setError('كلمة المرور يجب أن تكون 4 أحرف على الأقل')
      return
    }
    if (email === 'akramhaig120@gmail.com') {
      setError('هذا البريد محجوز للمشرف الرئيسي')
      return
    }
    if (list.some(s => s.email === email.trim())) {
      setError('هذا البريد الإلكتروني مسجل مسبقاً')
      return
    }

    const newAdmin: SubAdmin = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      password: password,
      createdAt: new Date().toLocaleDateString('ar-SA'),
      status: 'active',
    }

    const updated = [...list, newAdmin]
    saveSubAdmins(updated)
    setList(updated)
    setShowForm(false)
    resetForm()
    setSuccess(`تم إنشاء حساب ${newAdmin.name} بنجاح`)
    setTimeout(() => setSuccess(''), 4000)
  }

  const handleToggleStatus = (id: string) => {
    const updated = list.map(s =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' as const : 'active' as const } : s
    )
    saveSubAdmins(updated)
    setList(updated)
  }

  const handleDelete = (id: string) => {
    const updated = list.filter(s => s.id !== id)
    saveSubAdmins(updated)
    setList(updated)
    setDeleteId(null)
    setSuccess('تم حذف المشرف بنجاح')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#'
    let p = ''
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)]
    setPassword(p)
    setShowPass(true)
  }

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>إدارة المشرفين</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>أنشئ حسابات مشرفين فرعيين للوصول المحدود للوحة التحكم</p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Cairo',sans-serif",
          }}
        >
          <UserPlus size={16} />
          إضافة مشرف جديد
        </button>
      </div>

      {/* Success Alert */}
      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,217,126,0.1)', border: '1px solid rgba(0,217,126,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#00A86B', fontSize: '0.85rem' }}>
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* Info Card */}
      <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Shield size={18} style={{ color: '#0EA5E9', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0EA5E9', marginBottom: 4 }}>صلاحيات المشرف الفرعي</div>
          <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.7 }}>
            المشرفون الفرعيون يمكنهم الوصول فقط إلى:
            <span style={{ fontWeight: 700, color: '#1E293B' }}> العملاء والحسابات</span>،
            <span style={{ fontWeight: 700, color: '#1E293B' }}> المحافظ الاستثمارية</span>،
            <span style={{ fontWeight: 700, color: '#1E293B' }}> العمليات</span>.
            ولا يمكنهم رؤية أي أقسام أخرى.
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={18} color="#0EA5E9" />
            إنشاء حساب مشرف جديد
          </div>

          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: 6 }}>الاسم الكامل *</label>
                <div style={{ position: 'relative' }}>
                  <Users size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="اسم المشرف"
                    style={{ width: '100%', padding: '10px 38px 10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.82rem', fontFamily: "'Cairo',sans-serif", color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#0EA5E9'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: 6 }}>البريد الإلكتروني *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    style={{ width: '100%', padding: '10px 38px 10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.82rem', fontFamily: "'Cairo',sans-serif", color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#0EA5E9'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: 6 }}>كلمة المرور *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Lock size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="كلمة المرور"
                    style={{ width: '100%', padding: '10px 38px 10px 40px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.82rem', fontFamily: "'Cairo',sans-serif", color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#0EA5E9'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  style={{ padding: '10px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.78rem', fontFamily: "'Cairo',sans-serif", color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
                >
                  توليد تلقائي
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,69,96,0.08)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#EF4444', fontSize: '0.8rem' }}>
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.9rem', fontWeight: 800, fontFamily: "'Cairo',sans-serif", cursor: 'pointer' }}>
                ✅ إنشاء الحساب
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm() }} style={{ padding: '11px 20px', background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: '0.85rem', fontFamily: "'Cairo',sans-serif", cursor: 'pointer' }}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-Admins Table */}
      {list.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8F0', borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>👤</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>لا يوجد مشرفون فرعيون بعد</div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: 20 }}>أنشئ حساب مشرف فرعي للوصول المحدود للوحة التحكم</div>
          <button
            onClick={() => { setShowForm(true); resetForm() }}
            style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Cairo',sans-serif", cursor: 'pointer' }}
          >
            + إضافة أول مشرف
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} color="#0EA5E9" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>المشرفون الفرعيون ({list.length})</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['الاسم', 'البريد الإلكتروني', 'كلمة المرور', 'تاريخ الإنشاء', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map(admin => (
                  <tr key={admin.id} style={{ borderBottom: '1px solid rgba(226,232,240,0.7)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,165,233,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                          {admin.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{admin.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', color: '#475569', fontFamily: 'monospace' }}>{admin.email}</span>
                        <button onClick={() => handleCopy(admin.email, `email-${admin.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', padding: 2 }} title="نسخ">
                          {copiedId === `email-${admin.id}` ? <CheckCircle size={13} color="#00D97E" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    {/* Password */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', color: '#475569', fontFamily: 'monospace' }}>
                          {visiblePassId === admin.id ? admin.password : '••••••••'}
                        </span>
                        <button onClick={() => setVisiblePassId(visiblePassId === admin.id ? null : admin.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', padding: 2 }} title="إظهار/إخفاء">
                          {visiblePassId === admin.id ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button onClick={() => handleCopy(admin.password, `pass-${admin.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', padding: 2 }} title="نسخ">
                          {copiedId === `pass-${admin.id}` ? <CheckCircle size={13} color="#00D97E" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{admin.createdAt}</span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleToggleStatus(admin.id)}
                        style={{
                          padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: "'Cairo',sans-serif",
                          background: admin.status === 'active' ? 'rgba(0,217,126,0.12)' : 'rgba(148,163,184,0.15)',
                          color: admin.status === 'active' ? '#00A86B' : '#64748B',
                        }}
                        title="انقر لتغيير الحالة"
                      >
                        {admin.status === 'active' ? '● نشط' : '○ معطل'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px' }}>
                      {deleteId === admin.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>تأكيد الحذف؟</span>
                          <button onClick={() => handleDelete(admin.id)} style={{ padding: '4px 10px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>نعم</button>
                          <button onClick={() => setDeleteId(null)} style={{ padding: '4px 10px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>لا</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(admin.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#EF4444', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}
                        >
                          <Trash2 size={13} />
                          حذف
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
