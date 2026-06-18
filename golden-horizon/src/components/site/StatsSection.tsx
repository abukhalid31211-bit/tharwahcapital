import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 2000) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return { ref, val };
}

function Stat({ value, suffix = "", prefix = "", label }: { value: number; suffix?: string; prefix?: string; label: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div ref={ref} className="text-center px-6 py-10 border-l border-border/60 last:border-l-0">
      <div className="font-display text-5xl md:text-6xl font-black text-gradient-gold leading-none">
        {prefix}
        <span className="font-mono">{val.toLocaleString("en-US")}</span>
        {suffix}
      </div>
      <div className="mt-3 text-sm font-semibold text-text-muted tracking-wide">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y border-gold/30 bg-gradient-navy">
      <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4">
        <Stat value={5000} prefix="+" suffix="" label="عميل حول العالم" />
        <Stat value={2} prefix="+$" suffix="B" label="أصول تحت الإدارة" />
        <Stat value={15} prefix="+" suffix=" سنة" label="خبرة في الأسواق" />
        <Stat value={98} suffix="%" label="نسبة رضا العملاء" />
      </div>
    </section>
  );
}
