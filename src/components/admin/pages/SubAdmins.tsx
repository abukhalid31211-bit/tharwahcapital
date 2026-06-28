import { useState, useEffect } from 'react'
import { UserPlus, Trash2, Eye, EyeOff, Shield, Mail, Lock, CheckCircle, AlertTriangle, RefreshCw, Edit2, X, Copy, Check } from 'lucide-react'
import { getSubAdmins as apiGetSubAdmins, createSubAdmin as apiCreateSubAdmin, deleteSubAdmin as apiDeleteSubAdmin, updateSubAdmin as apiUpdateSubAdmin, type SubAdmin } from '../../../lib/api'

const PERMISSION_OPTIONS = [
  { key: 'clients',      label: '👥 العملاء والحسابات' },
  { key: 'portfolios',   label: '💼 المحافظ الاستثمارية' },
  { key: 'transactions', label: '💳 العمليات والصفقات' },
  { key: 'messages',     label: '💬 الرسائل' },
  { key: 'content',      label: '📄 المحتوى' },
  { key: 'reports',      label: '📊 التقارير' },
]

export default function SubAdmins() {
  const [list, setList]         = useState<SubAdmin[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [permissions, setPermissions] = useState<string[]>(['clients', 'portfolios', 'transactions'])
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // stored plain-text passwords (only available after creation/reset)
  const [storedPasswords, setStoredPasswords] = useState<Record<string, string>>({})
  const [revealId, setRevealId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // edit modal
  const [editSub, setEditSub]           = useState<SubAdmin | null>(null)
  const [editName, setEditName]         = useState('')
  const [editEmail, setEditEmail]       = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [showEditPass, setShowEditPass] = useState(false)
  const [editError, setEditError]       = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { subAdmins } = await apiGetSubAdmins()
      setList(subAdmins)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const resetForm = () => { setName(''); setEmail(''); setPassword(''); setShowPass(false); setError(''); setPermissions(['clients', 'portfolios', 'transactions']) }

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#'
    let p = ''
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)]
    setPassword(p); setShowPass(true)
  }

  const togglePermission = (key: string) =>
    setPermissions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()) { setError('جميع الحقول مطلوبة'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('البريد الإلكتروني غير صحيح'); return }
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    if (permissions.length === 0) { setError('يجب اختيار صلاحية واحدة على الأقل'); return }
    setSubmitting(true)
    try {
      const { subAdmin } = await apiCreateSubAdmin({ name: name.trim(), email: email.trim(), password, permissions })
      setList(prev => [subAdmin, ...prev])
      // store plain-text password for display in list
      setStoredPasswords(prev => ({ ...prev, [subAdmin.id]: password }))
      setShowForm(false); resetForm()
      setSuccess(`✅ تم إنشاء حساب ${subAdmin.name} بنجاح`)
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الإنشاء')
    } finally {
      setSubmitting(false)
    }
  }

  const openEdit = (sub: SubAdmin) => {
    setEditSub(sub); setEditName(sub.name); setEditEmail(sub.email)
    setEditPassword(''); setShowEditPass(false); setEditError('')
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editSub) return
    setEditError('')
    if (!editName.trim() || !editEmail.trim()) { setEditError('الاسم والبريد مطلوبان'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) { setEditError('البريد الإلكتروني غير صحيح'); return }
    if (editPassword && editPassword.length < 6) { setEditError('كلمة المرور 6 أحرف على الأقل'); return }
    setEditSubmitting(true)
    try {
      const payload: { name: string; email: string; password?: string } = { name: editName.trim(), email: editEmail.trim() }
      if (editPassword.trim()) payload.password = editPassword.trim()
      const { subAdmin } = await apiUpdateSubAdmin(editSub.id, payload)
      setList(prev => prev.map(s => s.id === subAdmin.id ? subAdmin : s))
      if (editPassword.trim()) {
        setStoredPasswords(prev => ({ ...prev, [editSub.id]: editPassword.trim() }))
      }
      setEditSub(null)
      setSuccess(`✅ تم تحديث بيانات ${subAdmin.name} بنجاح`)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'حدث خطأ أثناء التحديث')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteSubAdmin(id)
      const deleted = list.find(s => s.id === id)
      setList(prev => prev.filter(s => s.id !== id))
      setDeleteId(null)
      // signal force-logout for this sub-admin (same or other device via storage event)
      try {
        const existing: string[] = JSON.parse(localStorage.getItem('tharwah_force_logout') || '[]')
        if (!existing.includes(id)) {
          localStorage.setItem('tharwah_force_logout', JSON.stringify([...existing, id]))
        }
      } catch { /* ignore */ }
      setSuccess(`🗑️ تم حذف المشرف ${deleted?.name || ''} بنجاح وسيتم تسجيل خروجه تلقائياً`)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'فشل حذف المشرف')
    }
  }

  const copyPassword = (id: string, pw: string) => {
    navigator.clipboard.writeText(pw).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }).catch(() => {})
  }

  const permLabel = (key: string) => PERMISSION_OPTIONS.find(p => p.key === key)?.label ?? key

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>إدارة المشرفين</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>أنشئ حسابات مشرفين فرعيين وحدد صلاحياتهم</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif", color: '#475569' }}>
            <RefreshCw size={14} /> تحديث
          </button>
          <button onClick={() => { setShowForm(true); resetForm() }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>
            <UserPlus size={16} /> إضافة مشرف جديد
          </button>
        </div>
      </div>

      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,217,126,0.1)', border: '1px solid rgba(0,217,126,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#00A86B', fontSize: '0.85rem' }}>
          <CheckCircle size={16} />{success}
        </div>
      )}
      {error && !showForm && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FF4560', fontSize: '0.85rem' }}>
          <AlertTriangle size={16} />{error}
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 480, maxWidth: '92vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>إضافة مشرف جديد</h2>
              <button onClick={() => { setShowForm(false); resetForm() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>الاسم الكامل</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="اسم المشرف" style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.85rem', fontFamily: "'Cairo',sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>البريد الإلكتروني</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.85rem', fontFamily: "'Cairo',sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>كلمة المرور</label>
                <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Lock size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 36px 10px 36px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.85rem', fontFamily: "'Cairo',sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <button type="button" onClick={generatePassword} style={{ padding: '10px 12px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif", color: '#475569', whiteSpace: 'nowrap' }}>
                    توليد
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>الصلاحيات</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
                  {PERMISSION_OPTIONS.map(opt => (
                    <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 8, background: permissions.includes(opt.key) ? 'rgba(14,165,233,0.08)' : 'transparent', border: `1px solid ${permissions.includes(opt.key) ? 'rgba(14,165,233,0.25)' : 'transparent'}` }}>
                      <input type="checkbox" checked={permissions.includes(opt.key)} onChange={() => togglePermission(opt.key)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#0EA5E9' }} />
                      <span style={{ fontSize: '0.82rem', color: permissions.includes(opt.key) ? '#0EA5E9' : '#475569', fontWeight: permissions.includes(opt.key) ? 700 : 500 }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {error && <div style={{ color: '#FF4560', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={13} />{error}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Cairo',sans-serif", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? '⏳ جارٍ الإنشاء...' : 'إنشاء الحساب'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); resetForm() }} style={{ flex: 1, padding: '11px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editSub && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, maxWidth: '92vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>تعديل بيانات المشرف</h2>
              <button onClick={() => setEditSub(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>الاسم الكامل</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="اسم المشرف" style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.85rem', fontFamily: "'Cairo',sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>البريد الإلكتروني</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="admin@example.com" style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.85rem', fontFamily: "'Cairo',sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  كلمة المرور الجديدة <span style={{ color: '#94A3B8', fontWeight: 400 }}>(اتركها فارغة للإبقاء على القديمة)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input type={showEditPass ? 'text' : 'password'} value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="أدخل كلمة مرور جديدة" style={{ width: '100%', padding: '10px 36px 10px 36px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.85rem', fontFamily: "'Cairo',sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                  <button type="button" onClick={() => setShowEditPass(!showEditPass)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                    {showEditPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {editError && <div style={{ color: '#FF4560', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={13} />{editError}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button type="submit" disabled={editSubmitting} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, cursor: editSubmitting ? 'not-allowed' : 'pointer', fontFamily: "'Cairo',sans-serif", opacity: editSubmitting ? 0.7 : 1 }}>
                  {editSubmitting ? '⏳ جارٍ الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button type="button" onClick={() => setEditSub(null)} style={{ flex: 1, padding: '11px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>⏳ جارٍ التحميل...</div>
        ) : list.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👥</div>
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>لا يوجد مشرفون فرعيون حتى الآن</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr>
                  {['الاسم', 'البريد الإلكتروني', 'كلمة المرور', 'الصلاحيات', 'الحالة', 'تاريخ الإنشاء', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 600, color: '#64748B', borderBottom: '1px solid #E2E8F0', background: '#F1F5F9', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map(sub => {
                  const pw = storedPasswords[sub.id]
                  return (
                    <tr key={sub.id}>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#1E293B', borderBottom: '1px solid rgba(203,213,225,0.5)', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                            {sub.name.charAt(0)}
                          </div>
                          {sub.name}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#475569', borderBottom: '1px solid rgba(203,213,225,0.5)', fontFamily: 'monospace' }}>{sub.email}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(203,213,225,0.5)' }}>
                        {pw ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#1E293B', background: '#F1F5F9', padding: '3px 8px', borderRadius: 6, border: '1px solid #E2E8F0', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {revealId === sub.id ? pw : '••••••••'}
                            </span>
                            <button type="button" onClick={() => setRevealId(revealId === sub.id ? null : sub.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}>
                              {revealId === sub.id ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                            <button type="button" onClick={() => copyPassword(sub.id, pw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === sub.id ? '#00D97E' : '#94A3B8', padding: 2 }}>
                              {copiedId === sub.id ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>— غير متاحة</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(203,213,225,0.5)' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(sub.permissions && sub.permissions.length > 0 ? sub.permissions : ['clients','portfolios','transactions']).map(p => (
                            <span key={p} style={{ padding: '2px 7px', borderRadius: 12, fontSize: '0.62rem', fontWeight: 600, background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', border: '1px solid rgba(14,165,233,0.2)', whiteSpace: 'nowrap' }}>
                              {permLabel(p)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(203,213,225,0.5)' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: sub.status === 'active' ? 'rgba(0,217,126,0.1)' : 'rgba(255,69,96,0.1)', color: sub.status === 'active' ? '#00D97E' : '#FF4560', border: `1px solid ${sub.status === 'active' ? 'rgba(0,217,126,0.3)' : 'rgba(255,69,96,0.3)'}` }}>
                          {sub.status === 'active' ? '● نشط' : '● موقوف'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#64748B', borderBottom: '1px solid rgba(203,213,225,0.5)', whiteSpace: 'nowrap' }}>
                        {new Date(sub.created_at).toLocaleDateString('ar-SA')}
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(203,213,225,0.5)' }}>
                        {deleteId === sub.id ? (
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button onClick={() => handleDelete(sub.id)} style={{ padding: '5px 10px', background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.3)', borderRadius: 6, color: '#FF4560', fontSize: '0.7rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif", fontWeight: 700 }}>تأكيد الحذف</button>
                            <button onClick={() => setDeleteId(null)} style={{ padding: '5px 8px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 6, color: '#475569', fontSize: '0.7rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>إلغاء</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openEdit(sub)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 7, color: '#0EA5E9', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>
                              <Edit2 size={11} /> تعديل
                            </button>
                            <button onClick={() => setDeleteId(sub.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: 'rgba(255,69,96,0.08)', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 7, color: '#FF4560', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif" }}>
                              <Trash2 size={11} /> حذف
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}