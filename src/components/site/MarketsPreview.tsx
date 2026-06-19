import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Row = { name: string; sym: string; price: string; chg: number };

const data: Record<string, Row[]> = {
  "الأسهم": [
    { name: "أرامكو", sym: "2222.SR", price: "35.20 ر.س", chg: 1.4 },
    { name: "بنك الراجحي", sym: "1120.SR", price: "91.80 ر.س", chg: -0.8 },
    { name: "NVIDIA", sym: "NVDA", price: "$875.40", chg: 3.2 },
    { name: "أبل", sym: "AAPL", price: "$192.53", chg: 0.6 },
    { name: "مصرف أبوظبي", sym: "ADCB", price: "9.42 د.إ", chg: 2.1 },
    { name: "مايكروسوفت", sym: "MSFT", price: "$418.20", chg: -0.3 },
  ],
  "رقمية": [
    { name: "Bitcoin", sym: "BTC/USD", price: "$67,320", chg: 2.4 },
    { name: "Ethereum", sym: "ETH/USD", price: "$3,512", chg: -1.2 },
    { name: "Solana", sym: "SOL/USD", price: "$175", chg: 4.1 },
    { name: "Ripple", sym: "XRP/USD", price: "$0.52", chg: -0.4 },
    { name: "BNB", sym: "BNB/USD", price: "$588", chg: 0.8 },
    { name: "Cardano", sym: "ADA/USD", price: "$0.46", chg: 1.5 },
  ],
  "معادن": [
    { name: "الذهب", sym: "XAU/USD", price: "$2,325/oz", chg: 0.5 },
    { name: "الفضة", sym: "XAG/USD", price: "$29.80/oz", chg: -0.3 },
    { name: "النفط WTI", sym: "CL", price: "$79.40/bbl", chg: 1.2 },
    { name: "برنت", sym: "BZ", price: "$83.10/bbl", chg: 0.9 },
    { name: "البلاتين", sym: "XPT/USD", price: "$993/oz", chg: 1.1 },
    { name: "الغاز", sym: "NG", price: "$2.18/MMBtu", chg: -2.1 },
  ],
};

export function MarketsPreview() {
  const [tab, setTab] = useState("الأسهم");
  const rows = data[tab] ?? [];

  return (
    <section className="py-24 bg-navy-mid">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">الأسواق</span>
            <h2 className="mt-2 text-4xl font-black text-foreground">أسعار <span className="text-gradient-gold">مباشرة</span></h2>
          </div>
          <Link to="/markets" className="inline-flex items-center gap-2 text-sm font-bold text-gold hover:gap-3 transition-all">
            عرض الكل <ArrowLeft className="size-4" />
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          {Object.keys(data).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${tab === t ? "bg-gradient-gold text-white shadow-gold" : "border border-border bg-white text-text-muted hover:border-gold hover:text-gold"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-white text-right">
                <th className="px-5 py-4 font-black text-foreground">الأصل</th>
                <th className="px-5 py-4 font-black text-foreground hidden sm:table-cell">الرمز</th>
                <th className="px-5 py-4 font-black text-foreground">السعر</th>
                <th className="px-5 py-4 font-black text-foreground">التغيير</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.sym} className={`border-b border-border hover:bg-gold/5 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-navy-mid/50"}`}>
                  <td className="px-5 py-4 font-bold text-foreground">{r.name}</td>
                  <td className="px-5 py-4 hidden sm:table-cell font-mono text-xs text-text-muted">{r.sym}</td>
                  <td className="px-5 py-4 font-mono font-bold text-foreground">{r.price}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-1 rounded-md ${r.chg >= 0 ? "text-up bg-up/10" : "text-down bg-down/10"}`}>
                      {r.chg >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {r.chg >= 0 ? "+" : ""}{r.chg}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-text-muted text-center">
          ⚠️ الأسعار مؤشرية وقد تكون متأخرة 15 دقيقة. لا تُعدّ نصيحة استثمارية.
        </p>
      </div>
    </section>
  );
}
