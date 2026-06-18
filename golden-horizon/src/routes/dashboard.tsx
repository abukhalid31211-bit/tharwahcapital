import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, TrendingUp, TrendingDown, Wallet, BarChart3,
  Bell, Settings, LogOut, FileText, MessageSquare, ChevronRight,
  ArrowUpRight, ArrowDownRight, Menu, X
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const portfolio = [
  { name: "أسهم خليجية", alloc: 35, value: "$449,522", chg: 12.4, color: "bg-purple-500" },
  { name: "أسهم عالمية", alloc: 27, value: "$346,927", chg: 22.3, color: "bg-violet-500" },
  { name: "عملات رقمية", alloc: 21, value: "$269,833", chg: 45.8, color: "bg-fuchsia-500" },
  { name: "معادن", alloc: 10, value: "$128,492", chg: 11.7, color: "bg-indigo-500" },
  { name: "نقد", alloc: 7, value: "$89,944", chg: 0, color: "bg-slate-400" },
];

const transactions = [
  { type: "شراء", asset: "Bitcoin", amount: "+0.42 BTC", value: "$28,274", date: "14 يونيو 2025", dir: "in" },
  { type: "بيع", asset: "أرامكو", amount: "-200 سهم", value: "$7,040", date: "12 يونيو 2025", dir: "out" },
  { type: "شراء", asset: "NVIDIA", amount: "+15 سهم", value: "$13,131", date: "10 يونيو 2025", dir: "in" },
  { type: "توزيعات", asset: "الراجحي", amount: "+ربح سنوي", value: "$1,836", date: "5 يونيو 2025", dir: "in" },
  { type: "شراء", asset: "الذهب XAU", amount: "+5 oz", value: "$11,625", date: "1 يونيو 2025", dir: "in" },
];

const sideLinks = [
  { icon: LayoutDashboard, label: "لوحة التحكم", id: "overview" },
  { icon: BarChart3, label: "محفظتي", id: "portfolio" },
  { icon: FileText, label: "التقارير", id: "reports" },
  { icon: Bell, label: "الإشعارات", id: "notifications", badge: 3 },
  { icon: MessageSquare, label: "الدعم", id: "support" },
  { icon: Settings, label: "الإعدادات", id: "settings" },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sideOpen, setSideOpen] = useState(false);

  const totalValue = "$1,284,718";
  const totalChg = "+12.4%";

  return (
    <div className="min-h-screen bg-navy-mid flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-white border-l border-border flex flex-col transition-transform duration-300 ${sideOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold shadow-gold">
            <span className="font-black text-white">ر</span>
          </div>
          <div>
            <div className="font-black text-foreground text-sm">الثروة كابيتال كابيتال</div>
            <div className="text-[10px] text-gold">بوابة العملاء</div>
          </div>
          <button onClick={() => setSideOpen(false)} className="lg:hidden mr-auto text-text-muted">
            <X className="size-5" />
          </button>
        </div>

        {/* User */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-full bg-gradient-gold text-white font-black text-lg">م</div>
            <div>
              <div className="font-bold text-foreground text-sm">محمد العلي</div>
              <div className="text-xs text-text-muted">عميل بريميوم • منذ 2022</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {sideLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => { setActiveTab(l.id); setSideOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-semibold transition-all ${activeTab === l.id ? "bg-gold/10 text-gold" : "text-text-muted hover:bg-navy-mid hover:text-foreground"}`}
            >
              <l.icon className="size-5 shrink-0" />
              {l.label}
              {l.badge && (
                <span className="mr-auto grid h-5 w-5 place-items-center rounded-full bg-down text-white text-[10px] font-black">{l.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-text-muted hover:bg-navy-mid hover:text-foreground transition-all">
            <LogOut className="size-5" />
            تسجيل الخروج
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sideOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="border-b border-border bg-white px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSideOpen(true)} className="lg:hidden text-foreground">
            <Menu className="size-6" />
          </button>
          <div>
            <h1 className="font-black text-foreground text-lg">لوحة التحكم</h1>
            <p className="text-xs text-text-muted">آخر تحديث: اليوم 10:24 ص</p>
          </div>
          <div className="mr-auto flex items-center gap-3">
            <button className="relative text-text-muted hover:text-gold transition-colors">
              <Bell className="size-6" />
              <span className="absolute -top-1 -left-1 grid h-4 w-4 place-items-center rounded-full bg-down text-white text-[9px] font-black">3</span>
            </button>
            <div className="grid size-9 place-items-center rounded-full bg-gradient-gold text-white font-black">م</div>
          </div>
        </header>

        <main className="overflow-y-auto h-[calc(100vh-73px)] p-6">
          {/* Summary cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { title: "إجمالي المحفظة", value: totalValue, chg: totalChg, up: true, icon: Wallet },
              { title: "الأرباح السنوية", value: "$142,850", chg: "+12.4%", up: true, icon: TrendingUp },
              { title: "الأصول المُستثمرة", value: "$1,194,774", chg: "92.9%", up: true, icon: BarChart3 },
              { title: "النقد المتاح", value: "$89,944", chg: "7.1%", up: false, icon: ArrowDownRight },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-white p-6 hover:border-gold hover:shadow-card transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-text-muted">{c.title}</p>
                    <p className="mt-2 font-mono text-2xl font-black text-foreground">{c.value}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-mono font-bold mt-1 ${c.up ? "text-up" : "text-text-muted"}`}>
                      {c.up ? <ArrowUpRight className="size-3" /> : null}
                      {c.chg}
                    </span>
                  </div>
                  <div className="grid size-12 place-items-center rounded-xl bg-gold/10 border border-gold/20 text-gold">
                    <c.icon className="size-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Chart placeholder */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-foreground">أداء المحفظة</h2>
                <select className="text-xs border border-border rounded-lg px-2 py-1 bg-navy-mid text-text-muted focus:outline-none focus:border-gold">
                  <option>آخر 12 شهر</option>
                  <option>آخر 3 أشهر</option>
                  <option>منذ البداية</option>
                </select>
              </div>
              <svg viewBox="0 0 600 200" className="w-full">
                <defs>
                  <linearGradient id="pGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.25 300)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="oklch(0.55 0.25 300)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0,1,2,3,4].map(i => (
                  <line key={i} x1="0" y1={i*50} x2="600" y2={i*50} stroke="oklch(0.93 0.04 300)" strokeWidth="1" />
                ))}
                <polyline fill="none" stroke="oklch(0.55 0.25 300)" strokeWidth="3" strokeLinejoin="round"
                  points="0,160 60,140 120,150 180,110 240,120 300,80 360,90 420,55 480,60 540,35 600,40" />
                <polygon fill="url(#pGrad)"
                  points="0,160 60,140 120,150 180,110 240,120 300,80 360,90 420,55 480,60 540,35 600,40 600,200 0,200" />
                {["يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر","يناير","فبراير","مارس","أبريل","مايو","يونيو"].map((m, i) => (
                  <text key={m} x={i*54+5} y="195" fontSize="9" fill="oklch(0.48 0.04 280)">{m}</text>
                ))}
              </svg>
            </div>

            {/* Allocation */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="font-black text-foreground mb-5">توزيع الأصول</h2>
              <div className="flex flex-col gap-4">
                {portfolio.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className={`inline-block size-2.5 rounded-sm ${p.color}`} />
                        {p.name}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-mono font-bold text-foreground">{p.value}</span>
                        <span className={`font-mono font-bold ${p.chg > 0 ? "text-up" : p.chg < 0 ? "text-down" : "text-text-muted"}`}>
                          {p.chg > 0 ? "+" : ""}{p.chg}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-navy-light overflow-hidden">
                      <div className={`h-full rounded-full ${p.color} transition-all duration-700`} style={{ width: `${p.alloc}%` }} />
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">{p.alloc}% من المحفظة</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="mt-6 rounded-2xl border border-border bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-black text-foreground">آخر المعاملات</h2>
              <button className="inline-flex items-center gap-1 text-xs font-bold text-gold">
                عرض الكل <ChevronRight className="size-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-navy-mid text-right">
                    <th className="px-5 py-3 text-xs font-black text-foreground">النوع</th>
                    <th className="px-5 py-3 text-xs font-black text-foreground">الأصل</th>
                    <th className="px-5 py-3 text-xs font-black text-foreground">الكمية</th>
                    <th className="px-5 py-3 text-xs font-black text-foreground">القيمة</th>
                    <th className="px-5 py-3 text-xs font-black text-foreground hidden md:table-cell">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className="border-b border-border hover:bg-navy-mid/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${t.dir === "in" ? "bg-up/10 text-up" : "bg-down/10 text-down"}`}>
                          {t.dir === "in" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                          {t.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-foreground">{t.asset}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{t.amount}</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-foreground">{t.value}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-xs text-text-muted">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
