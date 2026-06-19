import { useState } from 'react'

const navItems = [
  { key: 'general', icon: '🏢', label: 'عام' },
  { key: 'appearance', icon: '🎨', label: 'المظهر' },
  { key: 'email', icon: '📧', label: 'البريد' },
  { key: 'security', icon: '🔒', label: 'الأمان' },
  { key: 'notifications', icon: '🔔', label: 'الإشعارات' },
  { key: 'financial', icon: '💰', label: 'المالية' },
  { key: 'seo', icon: '🌐', label: 'SEO' },
  { key: 'api', icon: '🔗', label: 'API' },
]

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <div onClick={() => setOn(!on)} style={{ width: 44, height: 24, borderRadius: 24, background: on ? '#C9A84C' : '#1A2E4A', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, right: on ? 3 : 23, transition: 'right 0.3s' }} />
    </div>
  )
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 28, borderBottom: '1px solid #1A2E4A' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E2E8F4' }}>{title}</div>
        {desc && <div style={{ fontSize: '0.8rem', color: '#6B84A8', marginTop: 4 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, defaultChecked }: { label: string; desc?: string; defaultChecked?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E2E8F4' }}>{label}</div>
        {desc && <div style={{ fontSize: '0.78rem', color: '#6B84A8', marginTop: 2 }}>{desc}</div>}
      </div>
      <Toggle defaultChecked={defaultChecked} />
    </div>
  )
}

function Input({ label, placeholder, type = 'text', defaultValue = '' }: { label: string; placeholder?: string; type?: string; defaultValue?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>{label}</label>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue}
        style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontSize: '0.875rem', fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = '#C9A84C'}
        onBlur={e => e.target.style.borderColor = '#1A2E4A'} />
    </div>
  )
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <>
            <Section title="إعدادات الشركة" desc="المعلومات الأساسية للشركة">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Input label="اسم الشركة *" defaultValue="الثروة كابيتال" />
                <Input label="البريد الرسمي *" type="email" defaultValue="info@altharoa.com" />
                <Input label="رقم الهاتف" defaultValue="+966 11 xxx xxxx" />
                <Input label="المدينة" defaultValue="الرياض" />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="العنوان" defaultValue="طريق الملك فهد، الرياض، المملكة العربية السعودية" />
                </div>
              </div>
            </Section>
            <Section title="شعار الموقع" desc="إدارة الشعارات المختلفة">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {['الشعار الرئيسي', 'الشعار الأبيض', 'Favicon'].map(l => (
                  <div key={l} style={{ aspectRatio: '16/9', border: '2px dashed #1A2E4A', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1A2E4A'}>
                    <div style={{ fontSize: '1.5rem' }}>🖼️</div>
                    <div style={{ fontSize: '0.72rem', color: '#6B84A8' }}>{l}</div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="روابط التواصل الاجتماعي">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[['LinkedIn', 'https://linkedin.com/company/...'], ['Twitter/X', 'https://twitter.com/...'], ['WhatsApp', '+966 5x xxx xxxx']].map(([p, ph]) => (
                  <Input key={p} label={p} placeholder={ph} />
                ))}
              </div>
            </Section>
          </>
        )

      case 'security':
        return (
          <Section title="إعدادات الأمان" desc="إدارة أمان المنصة">
            <ToggleRow label="المصادقة الثنائية (2FA)" desc="طلب رمز إضافي عند تسجيل الدخول" defaultChecked />
            <ToggleRow label="تسجيل محاولات الدخول الفاشلة" defaultChecked />
            <ToggleRow label="إشعار بريد عند دخول جديد" defaultChecked />
            <ToggleRow label="قفل الحساب بعد 5 محاولات فاشلة" defaultChecked />
            <ToggleRow label="انتهاء الجلسة بعد 8 ساعات" defaultChecked />
            <ToggleRow label="تتبع عناوين IP" defaultChecked />
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E2E8F4', marginBottom: 12 }}>مهلة انتهاء الجلسة (بالدقائق)</div>
              <input type="number" defaultValue={480} style={{ width: 120, padding: '8px 12px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontFamily: "'Cairo', sans-serif", outline: 'none' }} />
            </div>
          </Section>
        )

      case 'notifications':
        return (
          <Section title="إعدادات الإشعارات" desc="تحكم في أنواع الإشعارات التي تتلقاها">
            <ToggleRow label="إشعارات تسجيل العملاء الجدد" defaultChecked />
            <ToggleRow label="إشعارات الرسائل الجديدة" defaultChecked />
            <ToggleRow label="إشعارات العمليات الكبيرة" defaultChecked />
            <ToggleRow label="إشعارات انتهاء صلاحية التقارير" defaultChecked />
            <ToggleRow label="إشعارات تسجيل الدخول المشبوه" defaultChecked />
            <ToggleRow label="إشعارات البريد الإلكتروني" defaultChecked />
            <ToggleRow label="إشعارات WhatsApp" />
          </Section>
        )

      case 'financial':
        return (
          <Section title="الإعدادات المالية" desc="إعدادات العمليات المالية والعملات">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#6B84A8', marginBottom: 6 }}>العملة الرئيسية</label>
                <select style={{ width: '100%', padding: '10px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4', fontFamily: "'Cairo', sans-serif", outline: 'none' }}>
                  {['USD — دولار أمريكي', 'SAR — ريال سعودي', 'AED — درهم إماراتي'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Input label="الحد الأدنى للاستثمار ($)" defaultValue="1000" type="number" />
              <Input label="رسوم الإدارة (%)" defaultValue="1.5" type="number" />
              <Input label="رسوم الأداء (%)" defaultValue="20" type="number" />
            </div>
          </Section>
        )

      default:
        return (
          <div style={{ padding: 40, textAlign: 'center', color: '#6B84A8' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚙️</div>
            <div>اختر قسماً من القائمة الجانبية</div>
          </div>
        )
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>الإعدادات العامة</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Settings Nav */}
        <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 84 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'none', border: 'none', color: activeSection === item.key ? '#C9A84C' : '#6B84A8', fontSize: '0.875rem', fontWeight: activeSection === item.key ? 600 : 400, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", transition: 'all 0.2s', textAlign: 'right', borderRight: activeSection === item.key ? '2px solid #C9A84C' : '2px solid transparent', background: activeSection === item.key ? 'rgba(201,168,76,0.08)' : 'transparent' }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' }}>
          {renderContent()}

          {/* Save Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 28px', background: '#060E1A', borderTop: '1px solid #1A2E4A' }}>
            <button onClick={handleSave} style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s' }}>
              احفظ التغييرات
            </button>
            <button style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>إلغاء</button>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00D97E', fontSize: '0.85rem', animation: 'fadeIn 0.3s ease' }}>
                ✅ تم الحفظ بنجاح
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
