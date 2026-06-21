# Backend Architecture Guide — الثروة كابيتال

> **الحالة الحالية:** الموقع يعمل بالكامل على الواجهة الأمامية (React + Vite) مع localStorage لحفظ البيانات.  
> هذا المستند يصف البنية التقنية المقترحة عند الانتقال لبيئة إنتاجية حقيقية.

---

## نظرة عامة — المكدس التقني المقترح

```
┌─────────────────────────────────────────────────────────┐
│                    المستخدمون / العملاء                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel — CDN + Edge Network                  │
│   React SPA (Static)  +  Serverless Functions (API)      │
│   URL: tharwahcapital.com                                │
└──────────────┬──────────────────────────────────────────┘
               │ SQL / REST
               ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase                               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  PostgreSQL   │  │   Auth        │  │   Storage      │  │
│  │  (قاعدة بيانات)│  │  (تسجيل دخول) │  │  (رفع ملفات)  │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │  Realtime     │  │  Edge Funcs  │                      │
│  │  (تحديث فوري) │  │  (منطق أعمال) │                     │
│  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Supabase — قاعدة البيانات والخدمات الخلفية

### لماذا Supabase؟
- PostgreSQL مُدار (لا حاجة لإعداد خوادم)
- مصادقة جاهزة (بريد إلكتروني، OTP، OAuth)
- Realtime subscriptions لتحديثات لحظية (مثل: سعر المحفظة، إشعارات)
- Row Level Security (RLS) — أمان على مستوى الصف لكل عميل
- Storage لرفع المستندات (هوية، عقود)
- خطة مجانية سخية تكفي للبداية

### هيكل قاعدة البيانات المقترح

```sql
-- جدول العملاء
CREATE TABLE clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text NOT NULL,
  email       text UNIQUE NOT NULL,
  phone       text,
  nationality text,
  status      text DEFAULT 'pending', -- active | pending | frozen | suspended
  category    text DEFAULT 'standard', -- VIP | premium | standard
  portfolio_code text UNIQUE,
  advisor_id  uuid REFERENCES admins(id),
  created_at  timestamptz DEFAULT now()
);

-- جدول المحافظ الاستثمارية
CREATE TABLE portfolios (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    uuid REFERENCES clients(id) ON DELETE CASCADE,
  total_value  numeric DEFAULT 0,
  total_return numeric DEFAULT 0,
  cash_balance numeric DEFAULT 0,
  updated_at   timestamptz DEFAULT now()
);

-- جدول الأصول (مكونات المحفظة)
CREATE TABLE portfolio_assets (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE,
  asset_name   text NOT NULL,
  asset_code   text,
  asset_type   text, -- stocks | crypto | metals | forex | cash
  quantity     numeric DEFAULT 0,
  price        numeric DEFAULT 0,
  value        numeric DEFAULT 0,
  change_pct   numeric DEFAULT 0
);

-- جدول المعاملات
CREATE TABLE transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid REFERENCES clients(id),
  type        text NOT NULL, -- buy | sell | transfer
  asset       text NOT NULL,
  quantity    numeric,
  price       numeric,
  total       numeric,
  status      text DEFAULT 'pending', -- pending | completed | rejected
  note        text,
  created_at  timestamptz DEFAULT now(),
  executed_by uuid REFERENCES admins(id)
);

-- جدول المشرفين
CREATE TABLE admins (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text UNIQUE NOT NULL,
  role       text DEFAULT 'sub', -- super | sub
  created_at timestamptz DEFAULT now()
);

-- جدول الملاحظات
CREATE TABLE client_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  uuid REFERENCES clients(id) ON DELETE CASCADE,
  author_id  uuid REFERENCES admins(id),
  text       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- جدول الإعدادات العامة (سياسة الخصوصية، إلخ)
CREATE TABLE site_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now()
);
```

### Row Level Security (RLS) — الأمان

```sql
-- العميل يرى بياناته فقط
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_own_data" ON clients
  FOR SELECT USING (user_id = auth.uid());

-- المحافظ: العميل يرى محفظته فقط
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_own" ON portfolios
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );
```

---

## 2. Vercel — الاستضافة والنشر

### لماذا Vercel؟
- نشر فوري عند push إلى GitHub (CI/CD جاهز)
- Edge Network عالمي (CDN تلقائي)
- Serverless Functions لـ API routes
- متغيرات البيئة مُدارة بأمان
- نطاق مخصص مجاني مع SSL تلقائي

### بنية المشروع مع Vercel

```
/
├── src/                    ← React SPA (يُبنى كـ static files)
├── api/                    ← Vercel Serverless Functions
│   ├── auth/
│   │   ├── login.ts        ← POST /api/auth/login
│   │   └── logout.ts       ← POST /api/auth/logout
│   ├── clients/
│   │   ├── index.ts        ← GET  /api/clients (admin only)
│   │   └── [id].ts         ← GET/PUT /api/clients/:id
│   ├── portfolios/
│   │   └── [clientId].ts   ← GET /api/portfolios/:clientId
│   ├── transactions/
│   │   └── index.ts        ← GET/POST /api/transactions
│   └── settings/
│       └── [key].ts        ← GET/PUT /api/settings/:key
├── vercel.json             ← إعداد التوجيه
└── .env.local              ← المتغيرات السرية (محلياً فقط)
```

### vercel.json

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_key"
  }
}
```

### مثال على Serverless Function

```typescript
// api/portfolios/[clientId].ts
import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { clientId } = req.query

  // التحقق من الجلسة
  const token = req.headers.authorization?.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' })

  const { data, error } = await supabase
    .from('portfolios')
    .select('*, portfolio_assets(*)')
    .eq('client_id', clientId)
    .single()

  if (error) return res.status(404).json({ error: 'Portfolio not found' })
  return res.json(data)
}
```

---

## 3. المصادقة — Authentication

### تدفق تسجيل دخول العميل

```
1. العميل يدخل البريد الإلكتروني وكلمة المرور
2. Supabase Auth يتحقق ويُرجع JWT Token
3. الـ Token يُحفظ في httpOnly cookie (آمن)
4. كل طلب API يحمل الـ Token في Authorization header
5. Supabase RLS يتحقق من الهوية لكل query
```

```typescript
// في الواجهة الأمامية
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// تسجيل الدخول
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'client@example.com',
  password: 'password123',
})

// تسجيل الخروج
await supabase.auth.signOut()
```

### تدفق تسجيل دخول المشرف (Admin)

```
1. المشرف يدخل بياناته
2. نتحقق من جدول admins (وليس auth.users مباشرة)
3. نُنشئ جلسة مشفرة مع صلاحيات محددة (super / sub)
4. نُرجع JWT مخصص يحمل دور المشرف
```

---

## 4. Real-time Updates — التحديثات الفورية

```typescript
// الاشتراك في تغييرات المحفظة
const channel = supabase
  .channel('portfolio-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'portfolios',
    filter: `client_id=eq.${clientId}`,
  }, (payload) => {
    // تحديث الواجهة فوراً
    setPortfolio(payload.new)
  })
  .subscribe()
```

---

## 5. خطوات الانتقال من localStorage إلى Backend

```
المرحلة 1 — إعداد Supabase (يوم واحد)
├── إنشاء مشروع Supabase جديد
├── تشغيل SQL لإنشاء الجداول (انظر أعلاه)
├── تفعيل RLS على كل الجداول
└── اختبار الاتصال

المرحلة 2 — تحديث الواجهة الأمامية (3–5 أيام)
├── إضافة supabase-js للمشروع
├── استبدال localStorage بـ Supabase queries
├── تحديث نظام المصادقة
└── اختبار تدفق البيانات

المرحلة 3 — Vercel API Functions (2–3 أيام)
├── كتابة Functions للعمليات الحساسة (admin)
├── إعداد متغيرات البيئة على Vercel
└── اختبار شامل

المرحلة 4 — نشر الإنتاج (يوم واحد)
├── ربط GitHub بـ Vercel
├── إعداد النطاق المخصص
└── اختبار نهائي
```

---

## 6. التكاليف التقديرية

| الخدمة | الخطة المجانية | خطة الإنتاج |
|--------|---------------|-------------|
| Supabase | 500MB DB, 2GB storage, 50K users | $25/شهر |
| Vercel | 100GB bandwidth, 100 deployments | $20/شهر |
| **الإجمالي** | **مجاني للبداية** | **~$45/شهر** |

---

## 7. الأمان والامتثال

- ✅ تشفير البيانات في النقل (HTTPS/TLS 1.3)
- ✅ تشفير البيانات في التخزين (Supabase AES-256)
- ✅ Row Level Security لعزل بيانات العملاء
- ✅ JWT tokens قصيرة الصلاحية (1 ساعة + Refresh)
- ✅ Rate limiting على جميع endpoints
- ✅ Audit logs لكل عملية مشرف
- ⚠️ يجب الامتثال لأنظمة حماية البيانات المحلية (PDPL للسعودية، GDPR للعملاء الأوروبيين)

---

*هذا المستند للتخطيط فقط. التطبيق الحالي يعمل بـ localStorage ولا يتصل بأي خادم.*
