import { TrendingUp, TrendingDown } from "lucide-react";

const items = [
  { sym: "BTC/USD", price: "67,240", chg: 2.4, up: true },
  { sym: "ETH/USD", price: "3,180", chg: 1.8, up: true },
  { sym: "أرامكو", price: "27.45", chg: -0.3, up: false },
  { sym: "سابك", price: "142.40", chg: -0.6, up: false },
  { sym: "الذهب", price: "2,340", chg: 0.9, up: true },
  { sym: "برنت", price: "82.40", chg: -0.4, up: false },
  { sym: "AAPL", price: "189.50", chg: 0.8, up: true },
  { sym: "GOOG", price: "172.10", chg: 1.2, up: true },
  { sym: "الفضة", price: "29.80", chg: 1.4, up: true },
  { sym: "الإمارات دبي", price: "13.20", chg: -0.2, up: false },
];

export function LiveTicker() {
  const list = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-gold/30 bg-navy-dark/70 py-3">
      <div className="flex animate-ticker w-max gap-0">
        {list.map((it, i) => (
          <div key={i} className="flex items-center gap-3 px-6 border-l border-border whitespace-nowrap">
            <span className={`grid size-5 place-items-center rounded-full ${it.up ? "bg-up/15 text-up" : "bg-down/15 text-down"}`}>
              {it.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            </span>
            <span className="text-sm font-bold text-text-light">{it.sym}</span>
            <span className="font-mono text-sm text-text-muted">{it.price}</span>
            <span className={`font-mono text-xs font-bold ${it.up ? "text-up" : "text-down"}`}>
              {it.up ? "▲" : "▼"} {Math.abs(it.chg).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
