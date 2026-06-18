import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/markets")({ component: Markets });

type Asset = { name: string; sym: string; price: string; chg: number; vol: string; mktCap: string; };

const data: Record<string, Asset[]> = {
  "الأسهم": [
    { name: "أرامكو السعودية", sym: "2222.SR", price: "35.20 ر.س", chg: 1.4, vol: "12.3M", mktCap: "7.5T" },
    { name: "بنك الراجحي", sym: "1120.SR", price: "91.80 ر.س", chg: -0.8, vol: "4.1M", mktCap: "345B" },
    { name: "سابك", sym: "2010.SR", price: "83.50 ر.س", chg: 0.3, vol: "2.8M", mktCap: "265B" },
    { name: "مصرف أبوظبي", sym: "ADCB", price: "9.42 د.إ", chg: 2.1, vol: "8.6M", mktCap: "84B" },
    { name: "إمارات NBD", sym: "ENBD", price: "14.80 د.إ", chg: -0.5, vol: "3.2M", mktCap: "88B" },
    { name: "بنك القاهرة", sym: "CAIR", price: "12.25 ج.م", chg: 1.8, vol: "5.4M", mktCap: "22B" },
    { name: "أبل", sym: "AAPL", price: "$192.53", chg: 0.6, vol: "55.2M", mktCap: "3.0T" },
    { name: "مايكروسوفت", sym: "MSFT", price: "$418.20", chg: -0.3, vol: "22.1M", mktCap: "3.1T" },
    { name: "NVIDIA", sym: "NVDA", price: "$875.40", chg: 3.2, vol: "45.7M", mktCap: "2.1T" },
  ],
  "العملات الرقمية": [
    { name: "بيتكوين", sym: "BTC/USD", price: "$67,320", chg: 2.4, vol: "28.4B", mktCap: "1.32T" },
    { name: "إيثيريوم", sym: "ETH/USD", price: "$3,512", chg: -1.2, vol: "12.1B", mktCap: "422B" },
    { name: "بينانس كوين", sym: "BNB/USD", price: "$588", chg: 0.8, vol: "2.1B", mktCap: "85B" },
    { name: "ريبل", sym: "XRP/USD", price: "$0.52", chg: -0.4, vol: "1.8B", mktCap: "29B" },
    { name: "سولانا", sym: "SOL/USD", price: "$175", chg: 4.1, vol: "3.5B", mktCap: "80B" },
    { name: "كارديانو", sym: "ADA/USD", price: "$0.46", chg: 1.5, vol: "0.9B", mktCap: "16B" },
  ],
  "المعادن": [
    { name: "الذهب", sym: "XAU/USD", price: "$2,325/oz", chg: 0.5, vol: "N/A", mktCap: "N/A" },
    { name: "الفضة", sym: "XAG/USD", price: "$29.80/oz", chg: -0.3, vol: "N/A", mktCap: "N/A" },
    { name: "البلاتين", sym: "XPT/USD", price: "$993/oz", chg: 1.1, vol: "N/A", mktCap: "N/A" },
    { name: "البلاديوم", sym: "XPD/USD", price: "$925/oz", chg: -1.8, vol: "N/A", mktCap: "N/A" },
  ],
  "الطاقة": [
    { name: "النفط الخام WTI", sym: "CL", price: "$79.40/bbl", chg: 1.2, vol: "N/A", mktCap: "N/A" },
    { name: "برنت الخام", sym: "BZ", price: "$83.10/bbl", chg: 0.9, vol: "N/A", mktCap: "N/A" },
    { name: "الغاز الطبيعي", sym: "NG", price: "$2.18/MMBtu", chg: -2.1, vol: "N/A", mktCap: "N/A" },
  ],
};

function Markets() {
  const [tab, setTab] = useState("الأسهم");
  const [search, setSearch] = useState("");

  const filtered = (data[tab] || []).filter(
    (r) => r.name.includes(search) || r.sym.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">الأسواق</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            أسواق مالية <span className="text-gradient-gold">مباشرة</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            تابع أسعار الأصول في الوقت الفعلي — أسهم خليجية وعالمية، عملات رقمية، معادن ونفط.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(data).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${tab === t ? "bg-gradient-gold text-white shadow-gold" : "border border-border bg-navy-mid text-text-muted hover:border-gold hover:text-gold"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search + refresh */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث في الأصول..."
                className="w-full rounded-xl border border-border bg-white py-2.5 pr-10 pl-4 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-muted hover:border-gold hover:text-gold transition-colors">
              <RefreshCw className="size-4" />
              تحديث
            </button>
            <span className="text-xs text-text-muted">آخر تحديث: منذ 5 دقائق</span>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-navy-mid text-right">
                    <th className="px-5 py-4 font-black text-foreground">الأصل</th>
                    <th className="px-5 py-4 font-black text-foreground">الرمز</th>
                    <th className="px-5 py-4 font-black text-foreground">السعر</th>
                    <th className="px-5 py-4 font-black text-foreground">التغيير</th>
                    <th className="px-5 py-4 font-black text-foreground hidden md:table-cell">الحجم</th>
                    <th className="px-5 py-4 font-black text-foreground hidden lg:table-cell">القيمة السوقية</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.sym} className={`border-b border-border transition-colors hover:bg-navy-mid ${i % 2 === 0 ? "bg-white" : "bg-navy-mid/50"}`}>
                      <td className="px-5 py-4">
                        <span className="font-bold text-foreground">{r.name}</span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-text-muted">{r.sym}</td>
                      <td className="px-5 py-4 font-mono font-bold text-foreground">{r.price}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-1 rounded-md ${r.chg >= 0 ? "text-up bg-up/10" : "text-down bg-down/10"}`}>
                          {r.chg >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {r.chg >= 0 ? "+" : ""}{r.chg}%
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-text-muted font-mono text-xs">{r.vol}</td>
                      <td className="px-5 py-4 hidden lg:table-cell text-text-muted font-mono text-xs">{r.mktCap}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="py-16 text-center text-text-muted">لا توجد نتائج مطابقة</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-text-muted text-center">
            ⚠️ الأسعار للأغراض المعلوماتية فقط وقد تكون متأخرة 15 دقيقة. لا تُعدّ نصيحة استثمارية.
          </p>
        </div>
      </section>
    </div>
  );
}
