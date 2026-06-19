export const ADMIN_CREDENTIALS = {
  email: 'akramhaig120@gmail.com',
  password: '0545',
}

export const mockClients = [
  { id: 1, name: 'محمد الأحمد', email: 'mohammed@email.com', phone: '+966501234567', country: '🇸🇦', city: 'الرياض', advisor: 'أحمد العمري', portfolio: 125400, status: 'active', category: 'VIP', joined: '2022-01-15', lastActive: 'اليوم' },
  { id: 2, name: 'سارة العمري', email: 'sara@email.com', phone: '+971501234567', country: '🇦🇪', city: 'دبي', advisor: 'خالد محمد', portfolio: 87200, status: 'active', category: 'standard', joined: '2022-03-20', lastActive: 'اليوم' },
  { id: 3, name: 'طارق القحطاني', email: 'tariq@email.com', phone: '+966501234568', country: '🇸🇦', city: 'جدة', advisor: 'أحمد العمري', portfolio: 234000, status: 'pending', category: 'premium', joined: '2021-11-05', lastActive: 'أمس' },
  { id: 4, name: 'نورة الشمري', email: 'noura@email.com', phone: '+974501234567', country: '🇶🇦', city: 'الدوحة', advisor: 'خالد محمد', portfolio: 56800, status: 'active', category: 'standard', joined: '2023-02-10', lastActive: 'منذ 3 أيام' },
  { id: 5, name: 'خالد التميمي', email: 'khalid@email.com', phone: '+96550123456', country: '🇰🇼', city: 'الكويت', advisor: 'أحمد العمري', portfolio: 189300, status: 'frozen', category: 'VIP', joined: '2020-08-22', lastActive: 'منذ أسبوع' },
  { id: 6, name: 'فاطمة الزهراني', email: 'fatima@email.com', phone: '+966501234569', country: '🇸🇦', city: 'الرياض', advisor: 'خالد محمد', portfolio: 43200, status: 'active', category: 'standard', joined: '2023-05-18', lastActive: 'اليوم' },
  { id: 7, name: 'عبدالله السالم', email: 'abdullah@email.com', phone: '+966501234570', country: '🇸🇦', city: 'الدمام', advisor: 'أحمد العمري', portfolio: 312000, status: 'active', category: 'VIP', joined: '2019-12-01', lastActive: 'اليوم' },
  { id: 8, name: 'ريم المطيري', email: 'reem@email.com', phone: '+965501234567', country: '🇰🇼', city: 'الكويت', advisor: 'خالد محمد', portfolio: 78900, status: 'pending', category: 'standard', joined: '2023-08-14', lastActive: 'أمس' },
]

export const mockPortfolios = [
  { clientId: 1, clientName: 'محمد الأحمد', total: 125400, return: 18.7, advisor: 'أحمد العمري', assets: [
    { name: 'أرامكو', type: 'stocks', qty: 100, price: 124, value: 12400, change: 2.1 },
    { name: 'BTC', type: 'crypto', qty: 0.5, price: 67240, value: 33620, change: 3.4 },
    { name: 'ذهب', type: 'metals', qty: 5, price: 2340, value: 11700, change: 0.9 },
    { name: 'Apple', type: 'stocks', qty: 50, price: 189.5, value: 9475, change: -1.2 },
  ]},
  { clientId: 2, clientName: 'سارة العمري', total: 87200, return: 14.3, advisor: 'خالد محمد', assets: [
    { name: 'Microsoft', type: 'stocks', qty: 30, price: 415, value: 12450, change: 1.8 },
    { name: 'ETH', type: 'crypto', qty: 5, price: 3820, value: 19100, change: 5.2 },
    { name: 'نفط برنت', type: 'oil', qty: 50, price: 87.3, value: 4365, change: -0.4 },
  ]},
  { clientId: 3, clientName: 'طارق القحطاني', total: 234000, return: 21.2, advisor: 'أحمد العمري', assets: [
    { name: 'Tesla', type: 'stocks', qty: 80, price: 245, value: 19600, change: -2.3 },
    { name: 'BTC', type: 'crypto', qty: 1.2, price: 67240, value: 80688, change: 3.4 },
    { name: 'ذهب', type: 'metals', qty: 20, price: 2340, value: 46800, change: 0.9 },
  ]},
]

export const mockTransactions = [
  { id: 5234, type: 'buy', client: 'محمد الأحمد', asset: 'أرامكو', qty: 100, price: 124, total: 12400, status: 'completed', date: '2025-01-09 10:45' },
  { id: 5233, type: 'sell', client: 'سارة العمري', asset: 'BTC', qty: 0.1, price: 67240, total: 6724, status: 'completed', date: '2025-01-09 10:32' },
  { id: 5232, type: 'buy', client: 'خالد التميمي', asset: 'ذهب', qty: 2, price: 2340, total: 4680, status: 'pending', date: '2025-01-09 10:15' },
  { id: 5231, type: 'buy', client: 'نورة الشمري', asset: 'Apple', qty: 50, price: 189.5, total: 9475, status: 'completed', date: '2025-01-09 09:50' },
  { id: 5230, type: 'sell', client: 'عبدالله السالم', asset: 'Microsoft', qty: 20, price: 415, total: 8300, status: 'completed', date: '2025-01-08 16:30' },
  { id: 5229, type: 'buy', client: 'فاطمة الزهراني', asset: 'ETH', qty: 2, price: 3820, total: 7640, status: 'pending', date: '2025-01-08 14:20' },
  { id: 5228, type: 'transfer', client: 'ريم المطيري', asset: 'USD', qty: 10000, price: 1, total: 10000, status: 'pending', date: '2025-01-08 11:00' },
]

export const mockMessages = [
  { id: 1, client: 'محمد الأحمد', avatar: '', preview: 'كيف أداء محفظتي هذا الشهر؟', time: '10:45 ص', unread: 2, online: true, messages: [
    { id: 1, from: 'client', text: 'السلام عليكم، كيف أداء محفظتي هذا الشهر؟', time: '10:32 ص' },
    { id: 2, from: 'admin', text: 'وعليكم السلام، أداءها ممتاز! ارتفعت بنسبة 18.7% هذا الشهر', time: '10:35 ص' },
    { id: 3, from: 'client', text: 'شكراً جزيلاً 🙏', time: '10:36 ص' },
    { id: 4, from: 'client', text: 'كيف أداء محفظتي هذا الشهر؟', time: '10:45 ص' },
  ]},
  { id: 2, client: 'سارة العمري', avatar: '', preview: 'شكراً جزيلاً على المتابعة', time: 'أمس', unread: 0, online: false, messages: [
    { id: 1, from: 'client', text: 'شكراً جزيلاً على المتابعة المستمرة', time: 'أمس 14:00' },
    { id: 2, from: 'admin', text: 'دائماً في الخدمة. هل تحتاجين لأي شيء آخر؟', time: 'أمس 14:05' },
  ]},
  { id: 3, client: 'خالد التميمي', avatar: '', preview: 'متى سيصدر التقرير الشهري؟', time: 'منذ 3 أيام', unread: 1, online: false, messages: [
    { id: 1, from: 'client', text: 'متى سيصدر التقرير الشهري؟', time: 'منذ 3 أيام' },
  ]},
]

export const mockArticles = [
  { id: 1, title: 'توقعات أسواق الخليج لعام 2025', category: 'تحليل', status: 'published', author: 'أحمد المشرف', views: 1234, comments: 12, date: '2025-01-09', thumbnail: '' },
  { id: 2, title: 'تحليل أداء أرامكو بعد نتائج الربع الرابع', category: 'أسهم', status: 'draft', author: 'سارة المشرفة', views: 876, comments: 5, date: '2025-01-08', thumbnail: '' },
  { id: 3, title: 'البيتكوين يكسر حاجز 70 ألف دولار', category: 'رقمي', status: 'published', author: 'أحمد المشرف', views: 3421, comments: 28, date: '2025-01-07', thumbnail: '' },
  { id: 4, title: 'الذهب يسجل أعلى مستوياته في 3 سنوات', category: 'معادن', status: 'published', author: 'خالد المحرر', views: 987, comments: 8, date: '2025-01-06', thumbnail: '' },
]

export const mockTeam = [
  { id: 1, name: 'أحمد المشرف', email: 'akramhaig120@gmail.com', role: 'SUPER_ADMIN', clients: 0, lastActive: 'اليوم', status: 'active', joined: '2019-01-01' },
  { id: 2, name: 'خالد محمد', email: 'khalid@company.com', role: 'ADMIN', clients: 0, lastActive: 'اليوم', status: 'active', joined: '2020-03-15' },
  { id: 3, name: 'أحمد العمري', email: 'advisor1@company.com', role: 'ADVISOR', clients: 234, lastActive: 'منذ ساعة', status: 'active', joined: '2021-06-01' },
  { id: 4, name: 'سارة الزهراني', email: 'advisor2@company.com', role: 'ADVISOR', clients: 87, lastActive: 'أمس', status: 'active', joined: '2022-01-20' },
  { id: 5, name: 'نورة السالم', email: 'content@company.com', role: 'CONTENT_MANAGER', clients: 0, lastActive: 'اليوم', status: 'active', joined: '2023-03-10' },
]

export const mockNotifications = [
  { id: 1, type: 'critical', icon: '🔴', title: 'طلب تسجيل جديد', desc: 'محمد السالم يطلب الانضمام للمنصة', time: '10:45', read: false, actions: ['موافقة', 'رفض'] },
  { id: 2, type: 'warning', icon: '🟡', title: 'تقرير منتهي الصلاحية', desc: 'تقرير سارة العمري انتهت صلاحيته', time: '10:32', read: false, actions: ['تجديد'] },
  { id: 3, type: 'info', icon: '🔵', title: 'رسالة جديدة', desc: 'خالد التميمي: متى التقرير؟', time: '09:15', read: false, actions: ['رد'] },
  { id: 4, type: 'success', icon: '🟢', title: 'تم إرسال التقارير', desc: 'تم إرسال 45 تقرير شهري بنجاح', time: '08:00', read: true, actions: [] },
  { id: 5, type: 'info', icon: '💸', title: 'صفقة شراء ناجحة', desc: 'محمد الأحمد — أرامكو ($12,400)', time: 'أمس 15:20', read: true, actions: [] },
  { id: 6, type: 'info', icon: '👤', title: 'تعيين مستشار جديد', desc: 'تم تعيين مستشار جديد للعميل سارة', time: 'أمس 11:00', read: true, actions: [] },
]

export const mockLogs = [
  { id: 1, time: '10:45:23', user: 'أحمد المشرف', event: 'تسجيل دخول', ip: '197.48.12.55', status: 'success' },
  { id: 2, time: '10:30:11', user: 'خالد محمد', event: 'تعديل بيانات عميل', ip: '197.48.12.60', status: 'success' },
  { id: 3, time: '09:15:44', user: 'غير معروف', event: 'محاولة دخول فاشلة', ip: '45.227.115.8', status: 'failed' },
  { id: 4, time: '09:00:00', user: 'نورة السالم', event: 'نشر مقال جديد', ip: '197.48.12.72', status: 'success' },
  { id: 5, time: '08:45:30', user: 'أحمد العمري', event: 'إضافة صفقة شراء', ip: '197.48.12.55', status: 'success' },
  { id: 6, time: '08:20:15', user: 'غير معروف', event: 'محاولة دخول فاشلة', ip: '45.227.115.8', status: 'failed' },
  { id: 7, time: '08:00:00', user: 'النظام', event: 'إرسال التقارير الشهرية', ip: 'localhost', status: 'success' },
]

export const chartAUM = [
  { month: 'يناير', aum: 1800 }, { month: 'فبراير', aum: 1920 }, { month: 'مارس', aum: 1850 },
  { month: 'أبريل', aum: 2100 }, { month: 'مايو', aum: 2050 }, { month: 'يونيو', aum: 2200 },
  { month: 'يوليو', aum: 2150 }, { month: 'أغسطس', aum: 2300 }, { month: 'سبتمبر', aum: 2250 },
  { month: 'أكتوبر', aum: 2350 }, { month: 'نوفمبر', aum: 2380 }, { month: 'ديسمبر', aum: 2400 },
]

export const chartRevenue = [
  { month: 'يناير', revenue: 45, profit: 28 }, { month: 'فبراير', revenue: 52, profit: 33 },
  { month: 'مارس', revenue: 48, profit: 30 }, { month: 'أبريل', revenue: 61, profit: 40 },
  { month: 'مايو', revenue: 58, profit: 38 }, { month: 'يونيو', revenue: 67, profit: 44 },
  { month: 'يوليو', revenue: 72, profit: 48 }, { month: 'أغسطس', revenue: 69, profit: 46 },
  { month: 'سبتمبر', revenue: 78, profit: 52 }, { month: 'أكتوبر', revenue: 84, profit: 56 },
  { month: 'نوفمبر', revenue: 88, profit: 59 }, { month: 'ديسمبر', revenue: 94, profit: 63 },
]

export const chartPortfolioAlloc = [
  { name: 'خليجي', value: 38, color: '#3B82F6' },
  { name: 'عالمي', value: 27, color: '#C9A84C' },
  { name: 'رقمي', value: 18, color: '#F59E0B' },
  { name: 'معادن', value: 12, color: '#9CA3AF' },
  { name: 'نفط', value: 5, color: '#EF4444' },
]

export const chartNewClients = [
  { month: 'يوليو', clients: 45 }, { month: 'أغسطس', clients: 52 },
  { month: 'سبتمبر', clients: 38 }, { month: 'أكتوبر', clients: 61 },
  { month: 'نوفمبر', clients: 55 }, { month: 'ديسمبر', clients: 48 },
  { month: 'يناير', clients: 67 },
]

export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: '👑 Super Admin',
  ADMIN: '🔵 مشرف',
  ADVISOR: '🟡 مستشار',
  CONTENT_MANAGER: '🟢 محرر محتوى',
}

export const statusLabels: Record<string, string> = {
  active: 'نشط',
  pending: 'معلق',
  frozen: 'مجمد',
  inactive: 'غير نشط',
}
