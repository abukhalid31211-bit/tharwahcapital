import { ReactNode } from "react";

export function PageHero({ eyebrow, title, accent, subtitle }: { eyebrow: string; title: string; accent?: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-gold/30 bg-gradient-hero">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "linear-gradient(oklch(0.78 0.13 88) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.13 88) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="relative mx-auto max-w-5xl px-5 lg:px-8 py-24 lg:py-32 text-center">
        <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">{eyebrow}</span>
        <h1 className="mt-5 font-display text-5xl md:text-6xl font-black leading-tight text-text-light">
          {title}{accent && <> <span className="text-gradient-gold">{accent}</span></>}
        </h1>
        {subtitle && <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`py-20 lg:py-28 ${className}`}>{children}</section>;
}
