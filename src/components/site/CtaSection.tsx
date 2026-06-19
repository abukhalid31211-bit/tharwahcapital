import { Link } from "@tanstack/react-router";
import { Mail, CheckCircle2 } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-y border-gold/30 bg-gradient-to-br from-navy-mid to-navy-light py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.13 88 / 0.4), transparent 70%)" }} />
      </div>
      <div className="relative mx-auto max-w-3xl px-5 lg:px-8 text-center">
        <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">ابدأ الآن</span>
        <h2 className="mt-4 text-4xl md:text-6xl font-black leading-tight text-text-light">
          ابدأ رحلتك <span className="text-gradient-gold">الاستثمارية</span> اليوم
        </h2>
        <p className="mt-6 text-lg text-text-muted leading-relaxed">
          تواصل مع فريق خبرائنا المتخصصين، وسنضع لك خطة استثمارية متكاملة
          تناسب أهدافك وتطلعاتك المالية على المدى البعيد.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-8 py-4 text-base font-black text-navy-dark shadow-gold hover:-translate-y-1 transition-transform"
          >
            <Mail className="size-5" /> تواصل مع مستشار الآن
          </Link>
          <a
            href="https://wa.me/971000000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gold/50 bg-navy-dark/40 px-8 py-4 text-base font-bold text-gold hover:bg-navy-dark transition-colors"
          >
            استشارة عبر واتساب
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-muted">
          {["استشارة مجانية", "خبرة 15+ سنة", "خدمة 24/7", "سرّية تامة"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-gold" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
