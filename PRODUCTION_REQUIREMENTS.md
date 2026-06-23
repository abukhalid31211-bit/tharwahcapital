# وثيقة متطلبات التجهيز الإنتاجي — ثروة كابيتال
## Production Readiness Requirements Document

**تاريخ الإصدار:** يونيو 2026  
**الحالة الراهنة:** واجهة أمامية فقط (React SPA + localStorage)  
**الهدف:** نظام إنتاجي متكامل (Full-Stack)

---

## فهرس المحتويات

1. [ملخص تنفيذي](#1-ملخص-تنفيذي)
2. [المعمارية المقترحة](#2-المعمارية-المقترحة)
3. [قاعدة البيانات](#3-قاعدة-البيانات)
4. [نظام المصادقة والصلاحيات](#4-نظام-المصادقة-والصلاحيات)
5. [API — نقاط النهاية المطلوبة](#5-api--نقاط-النهاية-المطلوبة)
6. [الخدمات الخارجية المطلوبة](#6-الخدمات-الخارجية-المطلوبة)
7. [الأمان والامتثال](#7-الأمان-والامتثال)
8. [البيئة والمتغيرات السرية](#8-البيئة-والمتغيرات-السرية)
9. [البنية التحتية والنشر](#9-البنية-التحتية-والنشر)
10. [خطة الهجرة والتنفيذ](#10-خطة-الهجرة-والتنفيذ)
11. [التكاليف التقديرية](#11-التكاليف-التقديرية)
12. [قائمة المراجعة النهائية](#12-قائمة-المراجعة-النهائية)

---

## 1. ملخص تنفيذي

### ما المشكلة الجوهرية؟

المشروع الحالي هو **واجهة أمامية فقط** — كل البيانات (العملاء، المحافظ، المعاملات، إعدادات الموقع) محفوظة في `localStorage` داخل متصفح المستخدم. هذا يعني:

| المشكلة | التأثير المباشر |
|---------|---------------|
| البيانات تختفي عند مسح المتصفح | العملاء يفقدون بياناتهم |
| لا مشاركة بيانات بين الأجهزة | المشرف على حاسوبه لا يرى ما سجله على هاتفه |
| بيانات دخول مشفرة في الكود | أي شخص يفتح DevTools يرى الكلمة السرية |
| لا إشعارات حقيقية | نماذج التواصل لا تُرسل لأحد |
| لا أسعار حية | أسعار الأسواق ثابتة ومزيفة |

### ما المطلوب؟

نظام متكامل يتكون من:
- **قاعدة بيانات** PostgreSQL محمية تحفظ كل البيانات بشكل دائم
- **خادم API** يتوسط بين الواجهة الأمامية وقاعدة البيانات
- **نظام مصادقة** حقيقي بـ JWT tokens
- **خدمات خارجية** للبريد الإلكتروني، أسعار الأسواق، وغيرها

---

## 2. المعمارية المقترحة

### الخيار الموصى به: Supabase + Vercel

```
┌──────────────────────────────────────────────────────────────┐
│                      المستخدمون / العملاء                      │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTPS
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Vercel CDN / Edge Network                    │
│                                                               │
│   ┌─────────────────────┐    ┌──────────────────────────┐    │
│   │   React SPA (Static) │    │  Vercel Serverless API    │    │
│   │   (الواجهة الأمامية)  │    │  /api/* endpoints         │    │
│   └─────────────────────┘    └──────────┬───────────────┘    │
└──────────────────────────────────────────┼───────────────────┘
                                           │ SQL / REST
                                           ▼
┌──────────────────────────────────────────────────────────────┐
│                          Supabase                             │
│                                                               │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐    │
│  │ PostgreSQL  │  │  Auth Service │  │  Storage (Files)  │    │
│  │ (قاعدة بيا │  │ (مصادقة)     │  │  (مستندات/صور)   │    │
│  └────────────┘  └──────────────┘  └───────────────────┘    │
│  ┌────────────┐  ┌──────────────┐                            │
│  │  Realtime  │  │  Edge Funcs  │                            │
│  │ (تحديث حي) │  │  (منطق أعمال)│                            │
│  └────────────┘  └──────────────┘                            │
└──────────────────────────────────────────────────────────────┘
                                           │
                            ┌──────────────┼──────────────┐
                            ▼              ▼              ▼
                     ┌──────────┐  ┌──────────┐  ┌──────────┐
                     │  Resend   │  │TwelveData│  │ Twilio   │
                     │  (بريد)   │  │ (أسواق)  │  │ (SMS/WA) │
                     └──────────┘  └──────────┘  └──────────┘
```

### لماذا Supabase تحديداً؟

- PostgreSQL مُدار — لا حاجة لإدارة خادم
- Auth جاهز مع JWT، OTP، OAuth بدون كود إضافي
- Row Level Security (RLS) — أمان على مستوى الصف لكل عميل
- Realtime subscriptions — تحديثات فورية للمحافظ والأسعار
- Storage لرفع المستندات (هوية، عقود)
- خطة مجانية تكفي للبداية

---

## 3. قاعدة البيانات

### الجداول المطلوبة

#### 3.1 جدول المشرفين `admins`

```sql
CREATE TABLE admins (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  email         text UNIQUE NOT NULL,
  role          text NOT NULL DEFAULT 'sub',
  -- 'super' | 'sub' | 'advisor' | 'content_manager'
  permissions   jsonb DEFAULT '{}',
  -- { "clients": true, "transactions": false, ... }
  status        text NOT NULL DEFAULT 'active',
  -- 'active' | 'inactive'
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES admins(id)
);
```

#### 3.2 جدول العملاء `clients`

```sql
CREATE TABLE clients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name       text NOT NULL,
  email           text UNIQUE NOT NULL,
  phone           text,
  nationality     text,
  country         text,
  city            text,
  status          text NOT NULL DEFAULT 'pending',
  -- 'active' | 'pending' | 'frozen' | 'suspended' | 'closed'
  category        text NOT NULL DEFAULT 'standard',
  -- 'VIP' | 'premium' | 'standard'
  portfolio_code  text UNIQUE,
  advisor_id      uuid REFERENCES admins(id),
  kyc_status      text DEFAULT 'pending',
  -- 'pending' | 'submitted' | 'approved' | 'rejected'
  kyc_docs        jsonb DEFAULT '[]',
  -- [{type: 'national_id', url: '...', uploaded_at: '...'}]
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES admins(id)
);
```

#### 3.3 جدول المحافظ `portfolios`

```sql
CREATE TABLE portfolios (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  total_value     numeric(18,2) NOT NULL DEFAULT 0,
  total_invested  numeric(18,2) NOT NULL DEFAULT 0,
  total_return    numeric(18,2) NOT NULL DEFAULT 0,
  return_pct      numeric(8,4) NOT NULL DEFAULT 0,
  cash_balance    numeric(18,2) NOT NULL DEFAULT 0,
  currency        text NOT NULL DEFAULT 'USD',
  last_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);
```

#### 3.4 جدول الأصول `portfolio_assets`

```sql
CREATE TABLE portfolio_assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id    uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  asset_name      text NOT NULL,
  asset_code      text NOT NULL,
  asset_type      text NOT NULL,
  -- 'stocks_gulf' | 'stocks_global' | 'crypto' |
  -- 'metals' | 'oil' | 'funds' | 'forex' | 'cash'
  quantity        numeric(18,8) NOT NULL DEFAULT 0,
  avg_buy_price   numeric(18,4) NOT NULL DEFAULT 0,
  current_price   numeric(18,4) NOT NULL DEFAULT 0,
  current_value   numeric(18,2) NOT NULL DEFAULT 0,
  unrealized_pnl  numeric(18,2) NOT NULL DEFAULT 0,
  unrealized_pct  numeric(8,4) NOT NULL DEFAULT 0,
  exchange        text,
  updated_at      timestamptz NOT NULL DEFAULT now()
);
```

#### 3.5 جدول المعاملات `transactions`

```sql
CREATE TABLE transactions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       uuid NOT NULL REFERENCES clients(id),
  portfolio_id    uuid REFERENCES portfolios(id),
  type            text NOT NULL,
  -- 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'transfer'
  asset_code      text,
  asset_name      text,
  asset_type      text,
  quantity        numeric(18,8),
  price           numeric(18,4),
  total_amount    numeric(18,2) NOT NULL,
  fees            numeric(18,2) DEFAULT 0,
  currency        text NOT NULL DEFAULT 'USD',
  status          text NOT NULL DEFAULT 'pending',
  -- 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled'
  note            text,
  reference_no    text UNIQUE DEFAULT 'TXN-' || substr(gen_random_uuid()::text, 1, 8),
  executed_at     timestamptz,
  executed_by     uuid REFERENCES admins(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES admins(id)
);
```

#### 3.6 جدول رسائل التواصل `contact_messages`

```sql
CREATE TABLE contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  service     text,
  message     text NOT NULL,
  source      text NOT NULL DEFAULT 'contact',
  -- 'contact' | 'support' | 'newsletter'
  status      text NOT NULL DEFAULT 'new',
  -- 'new' | 'read' | 'replied' | 'archived'
  replied_at  timestamptz,
  replied_by  uuid REFERENCES admins(id),
  ip_address  inet,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

#### 3.7 جدول الإشعارات `notifications`

```sql
CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient   text NOT NULL,
  -- 'admin' | 'client' | client_id (uuid)
  type        text NOT NULL,
  -- 'new_message' | 'transaction' | 'portfolio_update' | 'system'
  title       text NOT NULL,
  body        text NOT NULL,
  data        jsonb DEFAULT '{}',
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

#### 3.8 جدول إعدادات الموقع `site_settings`

```sql
CREATE TABLE site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES admins(id)
);
```

**السجلات الأولية المطلوبة:**

```sql
INSERT INTO site_settings (key, value) VALUES
  ('hero',          '{"badge":"...","typewriterText":"..."}'),
  ('stats',         '[{"label":"عملاء","value":5000}]'),
  ('services',      '[...]'),
  ('faq',           '[...]'),
  ('testimonials',  '[...]'),
  ('team',          '[...]'),
  ('footer',        '{"phone":"...","email":"..."}'),
  ('nav_links',     '[...]'),
  ('ticker',        '[...]'),
  ('market_assets', '[...]'),
  ('privacy_policy','{"ar":"...","en":"..."}'),
  ('site_name',     '{"ar":"ثروة كابيتال","en":"Tharwah Capital"}');
```

#### 3.9 جدول المقالات والأخبار `articles`

```sql
CREATE TABLE articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  title_ar     text NOT NULL,
  title_en     text,
  content_ar   text,
  content_en   text,
  excerpt_ar   text,
  excerpt_en   text,
  thumbnail    text,
  category     text,
  status       text NOT NULL DEFAULT 'draft',
  -- 'draft' | 'published' | 'archived'
  views_count  integer NOT NULL DEFAULT 0,
  author_id    uuid REFERENCES admins(id),
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
```

#### 3.10 جدول سجل التدقيق `audit_logs`

```sql
CREATE TABLE audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid,
  actor_type  text,
  -- 'admin' | 'client' | 'system'
  actor_email text,
  action      text NOT NULL,
  -- 'login' | 'logout' | 'create_client' | 'update_transaction' | ...
  resource    text,
  resource_id text,
  old_value   jsonb,
  new_value   jsonb,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

### Row Level Security (RLS)

```sql
-- العملاء يرون بياناتهم فقط
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_own_data" ON clients
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- المحافظ: العميل يرى محفظته فقط
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_own" ON portfolios
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

-- المعاملات: العميل يرى معاملاته فقط
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transactions_own" ON transactions
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

-- المشرفون: وصول كامل عبر service_role key (على الخادم فقط)
-- لا تُعطِ service_role key للواجهة الأمامية أبداً
```

---

## 4. نظام المصادقة والصلاحيات

### 4.1 تدفق دخول المشرف

```
1. المشرف يُدخل البريد وكلمة المرور
2. POST /api/auth/admin/login
3. الخادم يتحقق من جدول admins عبر supabase (service_role)
4. يُنشئ JWT مخصص مع payload: { id, role, permissions }
5. يُرجع:
   - access_token  (مدة: 15 دقيقة)
   - refresh_token (مدة: 7 أيام، httpOnly cookie)
6. كل طلب API لاحق يحمل access_token في Header:
   Authorization: Bearer <token>
7. الخادم يتحقق من التوقيع ويستخرج الصلاحيات
```

### 4.2 تدفق دخول العميل

```
1. العميل يُدخل البريد وكلمة المرور
2. POST /api/auth/client/login
3. الخادم يتحقق عبر Supabase Auth (signInWithPassword)
4. Supabase يُرجع JWT تلقائياً
5. الواجهة الأمامية تحفظ الـ token في memory (وليس localStorage)
6. Supabase يتولى تجديد الـ token تلقائياً
```

### 4.3 مستويات الصلاحيات

```typescript
type AdminRole =
  | 'super'           // وصول كامل لكل شيء
  | 'admin'           // كل شيء ما عدا إدارة المشرفين والإعدادات الحساسة
  | 'advisor'         // يرى عملاءه فقط + محافظهم + يُنشئ معاملات
  | 'content_manager' // المقالات + إعدادات CMS فقط

const PERMISSIONS = {
  clients:      ['read', 'create', 'update', 'delete'],
  portfolios:   ['read', 'create', 'update'],
  transactions: ['read', 'create', 'update', 'approve', 'reject'],
  articles:     ['read', 'create', 'update', 'publish', 'delete'],
  settings:     ['read', 'update'],
  admins:       ['read', 'create', 'update', 'delete'],  // super فقط
  audit_logs:   ['read'],
  messages:     ['read', 'reply', 'delete'],
  reports:      ['read', 'export'],
}
```

### 4.4 حماية نسيت كلمة المرور

```
1. المشرف يطلب إعادة تعيين كلمة المرور
2. الخادم ينشئ token مؤقت (مدة: 1 ساعة)
3. يُرسل رابط عبر البريد الإلكتروني
4. المشرف يضغط الرابط ويُدخل كلمة مرور جديدة
5. الخادم يتحقق من الـ token ويُحدّث Supabase Auth
```

---

## 5. API — نقاط النهاية المطلوبة

### الاصطلاحات العامة

```
Base URL:  https://tharwahcapital.com/api
Auth:      Authorization: Bearer <jwt_token>
Format:    application/json
Versioning: /api/v1/...

Response الناجح:
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 50 }
}

Response الخطأ:
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "غير مصرح لك بهذا الإجراء"
  }
}
```

---

### 5.1 Auth Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| POST | `/api/v1/auth/admin/login` | دخول المشرف | عام |
| POST | `/api/v1/auth/admin/logout` | خروج المشرف | مشرف |
| POST | `/api/v1/auth/admin/refresh` | تجديد الـ token | عام |
| POST | `/api/v1/auth/admin/forgot-password` | طلب إعادة تعيين | عام |
| POST | `/api/v1/auth/admin/reset-password` | تعيين كلمة مرور جديدة | token مؤقت |
| POST | `/api/v1/auth/client/login` | دخول العميل | عام |
| POST | `/api/v1/auth/client/logout` | خروج العميل | عميل |
| GET  | `/api/v1/auth/me` | بيانات المستخدم الحالي | مشرف/عميل |

**مثال — طلب دخول المشرف:**
```json
POST /api/v1/auth/admin/login
{
  "email": "admin@tharwahcapital.com",
  "password": "SecureP@ssw0rd"
}

Response:
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "expires_in": 900,
    "admin": {
      "id": "uuid",
      "name": "أحمد المشرف",
      "role": "super",
      "permissions": { ... }
    }
  }
}
```

---

### 5.2 Clients Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/clients` | قائمة العملاء (مع فلترة وبحث) | مشرف |
| GET    | `/api/v1/clients/:id` | بيانات عميل واحد | مشرف |
| POST   | `/api/v1/clients` | إنشاء عميل جديد | مشرف |
| PUT    | `/api/v1/clients/:id` | تعديل بيانات العميل | مشرف |
| DELETE | `/api/v1/clients/:id` | حذف عميل | super |
| PATCH  | `/api/v1/clients/:id/status` | تغيير حالة العميل | مشرف |
| PATCH  | `/api/v1/clients/:id/advisor` | تعيين مستشار | مشرف |
| POST   | `/api/v1/clients/:id/credentials` | إنشاء بيانات دخول للعميل | مشرف |
| GET    | `/api/v1/clients/:id/activity` | سجل نشاط العميل | مشرف |

**Query Parameters للقائمة:**
```
GET /api/v1/clients?
  page=1
  &limit=20
  &search=محمد
  &status=active
  &category=VIP
  &advisor_id=uuid
  &sort=created_at
  &order=desc
```

---

### 5.3 Portfolios Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/portfolios/:clientId` | محفظة عميل (كاملة) | مشرف / عميل صاحب المحفظة |
| GET    | `/api/v1/portfolios/:clientId/assets` | الأصول فقط | مشرف / عميل |
| POST   | `/api/v1/portfolios/:clientId/assets` | إضافة أصل | مشرف |
| PUT    | `/api/v1/portfolios/:clientId/assets/:assetId` | تعديل أصل | مشرف |
| DELETE | `/api/v1/portfolios/:clientId/assets/:assetId` | حذف أصل | مشرف |
| GET    | `/api/v1/portfolios/:clientId/performance` | مخطط الأداء عبر الزمن | مشرف / عميل |
| POST   | `/api/v1/portfolios/refresh-prices` | تحديث أسعار الأصول | مشرف / cron job |

---

### 5.4 Transactions Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/transactions` | كل المعاملات (مع فلترة) | مشرف |
| GET    | `/api/v1/transactions/:id` | معاملة واحدة | مشرف / عميل صاحب المعاملة |
| GET    | `/api/v1/transactions/client/:clientId` | معاملات عميل | مشرف / عميل |
| POST   | `/api/v1/transactions` | إنشاء معاملة | مشرف |
| PATCH  | `/api/v1/transactions/:id/approve` | الموافقة على معاملة | مشرف (admin+) |
| PATCH  | `/api/v1/transactions/:id/reject` | رفض معاملة | مشرف (admin+) |
| GET    | `/api/v1/transactions/export` | تصدير CSV / PDF | مشرف |

---

### 5.5 Site Settings / CMS Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/settings/:key` | إعداد واحد | عام (للموقع) |
| GET    | `/api/v1/settings` | كل الإعدادات | مشرف |
| PUT    | `/api/v1/settings/:key` | تحديث إعداد | مشرف (content+) |

**مثال:**
```
GET /api/v1/settings/hero  → يُرجع بيانات قسم الـ Hero
GET /api/v1/settings/services → يُرجع قائمة الخدمات
```

---

### 5.6 Articles Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/articles` | قائمة المقالات المنشورة | عام |
| GET    | `/api/v1/articles/:slug` | مقال واحد | عام |
| GET    | `/api/v1/admin/articles` | كل المقالات (مسودات أيضاً) | مشرف |
| POST   | `/api/v1/admin/articles` | إنشاء مقال | content_manager+ |
| PUT    | `/api/v1/admin/articles/:id` | تعديل مقال | content_manager+ |
| PATCH  | `/api/v1/admin/articles/:id/publish` | نشر مقال | content_manager+ |
| DELETE | `/api/v1/admin/articles/:id` | حذف مقال | admin+ |

---

### 5.7 Contact & Notifications Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| POST   | `/api/v1/contact` | إرسال رسالة تواصل | عام |
| GET    | `/api/v1/admin/messages` | قائمة الرسائل | مشرف |
| PATCH  | `/api/v1/admin/messages/:id/status` | تغيير حالة الرسالة | مشرف |
| POST   | `/api/v1/admin/messages/:id/reply` | الرد على رسالة | مشرف |
| POST   | `/api/v1/newsletter/subscribe` | الاشتراك في النشرة | عام |
| GET    | `/api/v1/admin/notifications` | إشعارات المشرف | مشرف |
| PATCH  | `/api/v1/admin/notifications/read-all` | تعليم الكل مقروءاً | مشرف |

---

### 5.8 Market Data Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/market/prices` | أسعار الأصول المعروضة | عام |
| GET    | `/api/v1/market/ticker` | شريط الأسعار | عام |
| GET    | `/api/v1/market/price/:symbol` | سعر أصل واحد | مشرف |

---

### 5.9 Reports & Analytics Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/admin/analytics/overview` | ملخص لوحة التحكم | مشرف |
| GET    | `/api/v1/admin/analytics/aum` | منحنى الأصول المدارة | مشرف |
| GET    | `/api/v1/admin/analytics/clients-growth` | نمو العملاء شهرياً | مشرف |
| GET    | `/api/v1/admin/analytics/transactions` | ملخص المعاملات | مشرف |
| GET    | `/api/v1/admin/reports/client/:clientId` | تقرير عميل PDF | مشرف |
| GET    | `/api/v1/admin/audit-logs` | سجل التدقيق | super |

---

### 5.10 Admins Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| GET    | `/api/v1/admin/team` | قائمة المشرفين | super |
| POST   | `/api/v1/admin/team` | إضافة مشرف | super |
| PUT    | `/api/v1/admin/team/:id` | تعديل مشرف | super |
| PATCH  | `/api/v1/admin/team/:id/status` | تفعيل/تعطيل مشرف | super |
| DELETE | `/api/v1/admin/team/:id` | حذف مشرف | super |

---

### 5.11 File Upload Endpoints

| Method | Endpoint | الوصف | الصلاحيات |
|--------|----------|-------|-----------|
| POST   | `/api/v1/upload/kyc/:clientId` | رفع وثائق KYC | مشرف |
| POST   | `/api/v1/upload/article-image` | رفع صورة مقال | content_manager+ |
| DELETE | `/api/v1/upload/:fileId` | حذف ملف | مشرف |

---

## 6. الخدمات الخارجية المطلوبة

### 6.1 خدمة البريد الإلكتروني — Resend (موصى به)

**الاستخدام:**
- إشعار للمشرف عند وصول رسالة تواصل جديدة
- تأكيد للمستخدم عند إرسال رسالة التواصل
- بريد إعادة تعيين كلمة المرور
- تقارير شهرية للعملاء
- إشعارات الموافقة/رفض المعاملات
- رسالة ترحيب للعملاء الجدد

**الإعداد المطلوب:**
```
- إنشاء حساب على resend.com
- إضافة النطاق tharwahcapital.com وإعداد DNS records
- الحصول على API Key
- إنشاء قوالب البريد بالعربية والإنجليزية
```

**متغيرات البيئة:**
```env
RESEND_API_KEY=re_xxxx
EMAIL_FROM=no-reply@tharwahcapital.com
EMAIL_ADMIN=admin@tharwahcapital.com
```

---

### 6.2 أسعار الأسواق الحية — TwelveData أو Alpha Vantage

**الاستخدام:**
- شريط الأسعار المتحرك (Live Ticker)
- صفحة الأسواق
- تحديث أسعار الأصول في المحافظ

**TwelveData (موصى به للخليج والعالمي):**
```
- يدعم: تداول السعودية، بورصة الإمارات، NASDAQ، NYSE
- يدعم العملات الرقمية، المعادن، النفط، الفوركس
- خطة مجانية: 800 طلب / يوم
- خطة مدفوعة: $12/شهر
```

**متغيرات البيئة:**
```env
TWELVEDATA_API_KEY=xxxx
MARKET_CACHE_TTL=60   # تحديث كل 60 ثانية
```

**استراتيجية التخزين المؤقت (Caching):**
```
- الأسعار تُخزن في Redis (أو Supabase) لمدة 60 ثانية
- شريط الأسعار: WebSocket مباشر أو polling كل 30 ثانية
- أسعار المحافظ: تُحدَّث عند فتح المشرف/العميل للصفحة
```

---

### 6.3 رسائل SMS / واتساب (اختياري لكن مهم)

**الخيار A — Twilio (الأكثر شيوعاً):**
```
- SMS للتحقق بخطوتين (2FA)
- إشعارات المعاملات عبر SMS
```

**الخيار B — WhatsApp Business API (الأنسب للجمهور الخليجي):**
```
- إشعارات الصفقات عبر واتساب
- تأكيد تسجيل الدخول
- التواصل مع العملاء
- موفرون: Twilio، 360dialog، Infobip
```

**متغيرات البيئة:**
```env
TWILIO_ACCOUNT_SID=xxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_PHONE_NUMBER=+1234567890
WHATSAPP_API_KEY=xxxx
```

---

### 6.4 تخزين الملفات — Supabase Storage

**الاستخدام:**
- وثائق KYC للعملاء (هوية وطنية، جواز سفر)
- عقود الاستثمار (PDF)
- صور المقالات
- شعار الموقع والصور

**إعداد Buckets:**
```
- kyc-documents   → خاص (private) — يصل له المشرف فقط
- article-images  → عام (public)
- contracts       → خاص — يصل له العميل وملف له فقط
```

---

### 6.5 توليد PDF للتقارير — Puppeteer أو React-PDF

**الاستخدام:**
- تقارير المحافظ الشهرية للعملاء
- كشف المعاملات
- التقارير الضريبية

**التوصية:** استخدام `@react-pdf/renderer` في Serverless Function

---

### 6.6 Redis للتخزين المؤقت (اختياري للمرحلة الأولى)

**الاستخدام:**
- تخزين أسعار الأسواق مؤقتاً
- تخزين إعدادات الموقع (CMS) لتسريع التحميل
- حد المحاولات (Rate Limiting)

**البديل المجاني:** Upstash Redis

---

## 7. الأمان والامتثال

### 7.1 المشاكل الأمنية الحرجة في الكود الحالي (يجب إصلاحها فوراً)

```
❌ المشكلة: ADMIN_CREDENTIALS في adminData.ts
   الحل:    حذف الملف ونقل المصادقة للخادم

❌ المشكلة: كلمات مرور العملاء في mockClientAccounts
   الحل:    حذف كل mock data من الكود المصدري
             وتخزينها مشفرة في قاعدة البيانات (bcrypt)

❌ المشكلة: Auth يعتمد على localStorage.getItem('admin_auth')
   الحل:    استبدال بـ JWT tokens موقّعة من الخادم

❌ المشكلة: كلمة المرور '0545' (قصيرة جداً)
   الحل:    فرض سياسة كلمات مرور قوية (8+ أحرف، أرقام، رموز)
```

### 7.2 متطلبات الأمان للإنتاج

**المصادقة:**
```
- كلمات مرور مشفرة بـ bcrypt (cost factor: 12)
- JWT access tokens قصيرة (15 دقيقة)
- Refresh tokens طويلة في httpOnly cookies فقط
- تحقق بخطوتين (2FA) للمشرفين على الأقل
- قفل الحساب بعد 5 محاولات فاشلة
```

**الشبكة:**
```
- HTTPS إلزامي (TLS 1.3)
- HSTS header
- Content Security Policy (CSP)
- CORS مُقيَّد لنطاقات محددة فقط
- Rate Limiting: 100 طلب / دقيقة للواجهة العامة
```

**قاعدة البيانات:**
```
- Row Level Security (RLS) مُفعَّل على كل الجداول
- service_role key لا يُعطى للواجهة الأمامية أبداً
- anon key للعمليات العامة فقط
- كل عمليات المشرف تمر عبر الخادم (server-side)
```

**المدخلات:**
```
- Validation على كل input بـ Zod (frontend + backend)
- Sanitization لمنع XSS
- Parameterized queries لمنع SQL Injection (Drizzle/Supabase يوفره)
- حجم ملفات الرفع: حد أقصى 10MB
- أنواع ملفات مسموح بها فقط (PDF, JPG, PNG)
```

**الامتثال التنظيمي:**
```
- نظام حماية البيانات الشخصية (PDPL) — للمملكة العربية السعودية
- GDPR — للعملاء الأوروبيين
- سياسة خصوصية واضحة وقابلة للتحديث
- حق المستخدم في حذف بياناته
- سجل موافقات الكوكيز
```

---

## 8. البيئة والمتغيرات السرية

### ملف `.env.production` المطلوب

```env
# === Supabase ===
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...           # للواجهة الأمامية فقط
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # للخادم فقط — لا تضعه في الواجهة

# === JWT ===
JWT_SECRET=min-64-chars-random-string-here
JWT_ACCESS_EXPIRES=900             # 15 دقيقة بالثواني
JWT_REFRESH_EXPIRES=604800         # 7 أيام

# === Database Direct (للمهاجرات فقط) ===
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres

# === Email — Resend ===
RESEND_API_KEY=re_xxxx
EMAIL_FROM=no-reply@tharwahcapital.com
EMAIL_ADMIN=admin@tharwahcapital.com
EMAIL_SUPPORT=support@tharwahcapital.com

# === Market Data ===
TWELVEDATA_API_KEY=xxxx
MARKET_UPDATE_INTERVAL=60000       # كل دقيقة

# === File Storage ===
SUPABASE_STORAGE_BUCKET_KYC=kyc-documents
SUPABASE_STORAGE_BUCKET_ARTICLES=article-images
SUPABASE_STORAGE_BUCKET_CONTRACTS=contracts

# === WhatsApp / SMS ===
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_WHATSAPP_FROM=+14155238886

# === App Config ===
NODE_ENV=production
APP_URL=https://tharwahcapital.com
API_URL=https://tharwahcapital.com/api
SESSION_SECRET=another-long-random-secret

# === Rate Limiting (Upstash Redis) ===
UPSTASH_REDIS_URL=https://xxxx.upstash.io
UPSTASH_REDIS_TOKEN=xxxx
```

> **تحذير:** لا تضع هذه القيم في الكود المصدري أبداً. أضف `.env*` إلى `.gitignore`.

---

## 9. البنية التحتية والنشر

### 9.1 المتطلبات الأساسية

```
- حساب Supabase (supabase.com)
- حساب Vercel (vercel.com)  
- نطاق مُسجَّل (tharwahcapital.com)
- حساب Resend (resend.com) لتفعيل النطاق
- حساب TwelveData أو Alpha Vantage
```

### 9.2 إعداد Vercel

**هيكل `vercel.json`:**
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000" }
      ]
    }
  ],
  "functions": {
    "api/**/*.ts": { "maxDuration": 30 }
  }
}
```

### 9.3 إعداد DNS

```
النطاق: tharwahcapital.com
─────────────────────────────────────────
A     @          76.76.19.19   (Vercel)
CNAME www        cname.vercel-dns.com
TXT   @          "v=spf1 include:resend.com ~all"
TXT   _dmarc     "v=DMARC1; p=quarantine"
CNAME resend._domainkey  [من لوحة Resend]
```

### 9.4 CI/CD Pipeline

```
GitHub → push to main
         ↓
         Vercel detects changes
         ↓
         Build: pnpm build
         ↓
         Run: pnpm typecheck (اختياري)
         ↓
         Deploy to Production
         ↓
         Health check: GET /api/healthz
```

---

## 10. خطة الهجرة والتنفيذ

### المرحلة 1 — الأمان الفوري (يوم 1)

```
□ حذف ADMIN_CREDENTIALS من adminData.ts
□ حذف كلمات مرور العملاء من الكود
□ إنشاء مشروع Supabase
□ إضافة جداول admins و clients الأساسية
□ إنشاء أول حساب super admin عبر Supabase Auth
□ إنشاء /api/auth/admin/login على الخادم
□ تحديث AdminLogin.tsx لاستخدام API بدلاً من localStorage
□ Deploy للـ Vercel مع متغيرات البيئة
```

### المرحلة 2 — البنية الأساسية (الأسبوع 1-2)

```
□ إنشاء كل الجداول (portfolios, transactions, ...)
□ تفعيل RLS على كل الجداول
□ بناء كل الـ API endpoints (Auth, Clients, Portfolios)
□ استبدال mock data بقراءة حقيقية من قاعدة البيانات
□ نقل site_settings إلى Supabase
□ ربط CMS (Hero, Services, FAQ...) بـ API
□ اختبار شامل لكل العمليات
```

### المرحلة 3 — الخدمات الخارجية (الأسبوع 3)

```
□ ربط Resend وإنشاء قوالب البريد
□ اختبار إرسال بريد عند استلام رسالة تواصل
□ ربط TwelveData وتحديث شريط الأسعار
□ تحديث أسعار المحافظ تلقائياً
□ إنشاء Cron Job لتحديث الأسعار (Vercel Cron)
□ إعداد Supabase Storage للملفات
□ اختبار رفع وثائق KYC
```

### المرحلة 4 — التلميع والإطلاق (الأسبوع 4)

```
□ توحيد اسم الشركة في كل الملفات
□ تحديث رقم الواتساب الحقيقي
□ إضافة روابط Privacy Policy / Terms حقيقية
□ إضافة meta tags وOG tags لكل صفحة
□ إنشاء sitemap.xml ديناميكي
□ اختبار شامل من منظور العميل والمشرف
□ اختبار الأمان (OWASP checklist)
□ ربط النطاق المخصص على Vercel
□ الإطلاق الرسمي 🚀
```

---

## 11. التكاليف التقديرية

### الخطة المجانية (للبداية والاختبار)

| الخدمة | الحد المجاني |
|--------|-------------|
| Supabase | 500MB DB، 1GB Storage، 50,000 MAU |
| Vercel | 100GB bandwidth، 100 deployments/day |
| Resend | 3,000 بريد/شهر |
| TwelveData | 800 طلب/يوم |
| **الإجمالي** | **مجاني تماماً** |

### خطة الإنتاج (حتى 1000 عميل)

| الخدمة | التكلفة الشهرية |
|--------|----------------|
| Supabase Pro | $25 |
| Vercel Pro | $20 |
| Resend (50K email) | $20 |
| TwelveData Basic | $12 |
| Twilio SMS (1K رسالة) | ~$7 |
| **الإجمالي** | **~$84/شهر** |

---

## 12. قائمة المراجعة النهائية

### أمان ✅
```
□ لا بيانات حساسة في الكود المصدري
□ كل الـ secrets في متغيرات بيئة
□ HTTPS مُفعَّل
□ RLS مُفعَّل على كل الجداول
□ JWT tokens صحيحة وقصيرة المدة
□ Rate Limiting مُفعَّل
□ Input validation على الخادم والعميل
□ سجل التدقيق (audit_logs) يسجل كل العمليات
```

### وظيفية ✅
```
□ تسجيل الدخول للمشرف يعمل عبر API
□ تسجيل الدخول للعميل يعمل عبر API
□ CRUD كامل للعملاء يعمل
□ CRUD كامل للمعاملات يعمل
□ CMS يقرأ ويكتب من قاعدة البيانات
□ نماذج التواصل تُرسل بريداً إلكترونياً
□ أسعار الأسواق حية وتتحدث
□ رفع الملفات يعمل
□ توليد PDF يعمل
```

### المحتوى ✅
```
□ اسم الشركة موحد في كل الصفحات
□ رقم الواتساب حقيقي
□ روابط Privacy Policy / Terms حقيقية
□ عنوان حقيقي وبريد حقيقي
□ meta tags لكل صفحة
□ sitemap.xml موجود
□ robots.txt صحيح
□ favicon حقيقي
```

### الأداء ✅
```
□ الصور مُضغوطة (WebP)
□ Lazy loading للصور والمكونات
□ API responses مُخزَّنة مؤقتاً حيثما أمكن
□ Lighthouse score > 90
□ Core Web Vitals ضمن المعايير
```

---

## ملاحظة ختامية

المشروع الحالي **جاهز بصرياً ومكتمل من ناحية الواجهة** — وهذا إنجاز حقيقي. ما ينقصه هو الطبقة الخلفية التي تجعله **يعمل بشكل حقيقي** بدلاً من الاعتماد على بيانات وهمية في المتصفح.

**الأولوية القصوى:** إصلاح الثغرة الأمنية (بيانات الدخول في الكود) قبل أي نشر عام.

**الوقت التقديري للتنفيذ الكامل:** 3-4 أسابيع لمطور متمرس أو فريق صغير.

---

*هذه الوثيقة مرجع تقني شامل لتحويل الموقع من نموذج أولي إلى نظام إنتاجي حقيقي.*
