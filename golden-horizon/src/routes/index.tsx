import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/site/Hero";
import { LiveTicker } from "../components/site/LiveTicker";
import { ServicesSection } from "../components/site/ServicesSection";
import { MarketsPreview } from "../components/site/MarketsPreview";
import { LatestNews } from "../components/site/LatestNews";
import { StatsSection } from "../components/site/StatsSection";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Award, Users, TrendingUp, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const trustBadges = [
  { icon: ShieldCheck, text: "ترخيص رسمي معتمد" },
  { icon: Award, text: "جائزة أفضل شركة 2024" },
  { icon: Users, text: "+5,000 عميل موثوق" },
  { icon: TrendingUp, text: "عائد سنوي +22%" },
];

function Index() {
  return (
    <div className="bg-background">
      <Hero />
      <LiveTicker />

      {/* Trust badges */}
      <section className="py-10 border-y border-border bg-navy-mid">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {trustBadges.map((b) => (
              <div key={b.text} className="flex items-center gap-3">
                <b.icon className="size-5 text-gold" />
                <span className="text-sm font-bold text-foreground">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <StatsSection />
      <MarketsPreview />
      <LatestNews />

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-gold text-white text-center">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-4xl md:text-5xl font-black">ابدأ استثمارك اليوم</h2>
          <p className="mt-5 text-lg opacity-90 max-w-xl mx-auto leading-relaxed">
            استشارة مجانية مع خبرائنا المعتمدين — بدون أي التزام. ندير ثروتك بخبرة تمتد لـ 15 عاماً.
          </p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-gold font-black px-8 py-4 shadow-lg hover:-translate-y-1 transition-transform">
              احجز استشارة مجانية <ArrowLeft className="size-5" />
            </Link>
            <Link to="/services"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/50 text-white font-bold px-8 py-4 hover:bg-white/10 transition-colors">
              اكتشف خدماتنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
