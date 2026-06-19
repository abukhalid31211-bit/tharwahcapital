import { Link } from "@tanstack/react-router";
import { TrendingUp, Globe, Bitcoin, Building2, Gem, Fuel, ArrowLeft } from "lucide-react";

const services = [
  {
    id: "gulf-stocks",
    icon: TrendingUp,
    title: "الأسهم الخليجية والعربية",
    desc: "إدارة استثماراتك في أسواق تداول السعودية، أبوظبي، دبي، الكويت ومصر بفريق خبراء محليين.",
    color: "from-purple-50 to-white",
  },
  {
    id: "global-stocks",
    icon: Globe,
    title: "الأسهم العالمية",
    desc: "وصول مباشر إلى وول ستريت، ناسداك، لندن وطوكيو مع تحليلات مدعومة بالذكاء الاصطناعي.",
    color: "from-indigo-50 to-white",
  },
  {
    id: "crypto",
    icon: Bitcoin,
    title: "العملات الرقمية",
    desc: "محافظ منوّعة من Bitcoin و Ethereum والأصول الرقمية الواعدة بأمان مؤسسي.",
    color: "from-violet-50 to-white",
  },
  {
    id: "funds",
    icon: Building2,
    title: "صناديق الاستثمار",
    desc: "صناديق متخصصة بمستويات مخاطر متعددة تتلاءم مع أهدافك المالية قصيرة وطويلة المدى.",
    color: "from-purple-50 to-white",
  },
  {
    id: "metals",
    icon: Gem,
    title: "المعادن والذهب",
    desc: "تحوّط ذكي عبر الذهب والفضة والبلاتين كملاذ آمن ضد التضخم وتقلبات السوق.",
    color: "from-fuchsia-50 to-white",
  },
  {
    id: "energy",
    icon: Fuel,
    title: "النفط والطاقة",
    desc: "استثمارات في عقود النفط والغاز وأسهم شركات الطاقة المتجددة عالمياً.",
    color: "from-indigo-50 to-white",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">خدماتنا</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-foreground leading-tight">
            خدمات استثمارية <span className="text-gradient-gold">متكاملة</span>
          </h2>
          <p className="mt-5 text-text-muted text-lg leading-relaxed">
            نقدم باقة شاملة من الحلول الاستثمارية المصممة بعناية لتلبية تطلعاتك المالية
            في مختلف الأسواق العالمية.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${s.color} p-8 transition-all hover:-translate-y-2 hover:border-gold hover:shadow-gold`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-gold scale-x-0 transition-transform group-hover:scale-x-100" />
              <div className="grid size-14 place-items-center rounded-2xl bg-gold/10 text-gold border border-gold/20">
                <s.icon className="size-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{s.desc}</p>
              <Link
                to={`/service/${s.id}` as any}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold transition-all group-hover:gap-3 cursor-pointer"
              >
                اكتشف المزيد <ArrowLeft className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
