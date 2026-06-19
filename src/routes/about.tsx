import { createFileRoute } from "@tanstack/react-router";
import { Shield, Award, Users, TrendingUp, Globe, Star } from "lucide-react";

export const Route = createFileRoute("/about")({ component: About });

const timeline = [
  { year: "2010", title: "التأسيس", desc: "تأسست الشركة في دبي برأس مال أولي 50 مليون دولار وفريق من 12 خبيراً." },
  { year: "2013", title: "التوسع الإقليمي", desc: "افتتاح فروع في الرياض والكويت والقاهرة وأصول تجاوزت 500 مليون دولار." },
  { year: "2016", title: "الاعتراف الدولي", desc: "جائزة أفضل شركة استثمار في الشرق الأوسط من Bloomberg Markets." },
  { year: "2019", title: "الذكاء الاصطناعي", desc: "إطلاق منصة التحليل الذكي التي تخدم أكثر من 2000 عميل مؤسسي." },
  { year: "2022", title: "التوسع العالمي", desc: "مكاتب في لندن وسنغافورة والوصول إلى 15 سوقاً مالياً عالمياً." },
  { year: "2024", title: "رقمي أولاً", desc: "إطلاق منصة الاستثمار الرقمي ومحافظ العملات المشفرة المؤسسية." },
];

const team = [
  { name: "م. خالد الحربي", role: "الرئيس التنفيذي", bio: "خبرة 25 عاماً في الأسواق المالية الخليجية والعالمية.", ab: "خ" },
  { name: "د. سارة المطيري", role: "مدير الاستثمار", bio: "دكتوراه اقتصاد من MIT، متخصصة في الأسواق الناشئة.", ab: "س" },
  { name: "م. فيصل العمري", role: "رئيس التحليل", bio: "محلل CFA معتمد مع خبرة 18 عاماً في وول ستريت.", ab: "ف" },
  { name: "أ. ليلى السعيد", role: "مديرة خدمة العملاء", bio: "متخصصة في إدارة علاقات المستثمرين وبناء المحافظ المخصصة.", ab: "ل" },
  { name: "م. أحمد الزهراني", role: "رئيس التكنولوجيا", bio: "مهندس متخصص في أنظمة التداول الآلي والذكاء الاصطناعي.", ab: "أ" },
  { name: "م. هند القحطاني", role: "مدير المخاطر", bio: "خبرة 15 عاماً في إدارة المخاطر المالية وتحليل المحافظ.", ab: "ه" },
];

const values = [
  { icon: Shield, title: "الثقة والشفافية", desc: "نلتزم بأعلى معايير الشفافية في جميع تعاملاتنا مع عملائنا." },
  { icon: Award, title: "التميز المهني", desc: "فريق معتمد من أفضل الجامعات والمؤسسات المالية العالمية." },
  { icon: Users, title: "خدمة شخصية", desc: "خطة استثمارية مخصصة تناسب أهدافك وتحملك للمخاطر." },
  { icon: Globe, title: "وصول عالمي", desc: "شراكات مع أبرز البنوك والمؤسسات في أكثر من 30 دولة." },
];

function About() {
  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">من نحن</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            نصنع مستقبلك <span className="text-gradient-gold">المالي</span> منذ 2010
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            الثروة كابيتال كابيتال — شركة استثمارية رائدة تجمع الخبرة المحلية مع الوصول العالمي لأسواق المال.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-10">
            {[{ icon: TrendingUp, v: "$2B+", l: "أصول مدارة" }, { icon: Users, v: "5,000+", l: "عميل موثوق" }, { icon: Star, v: "98.5%", l: "نسبة رضا" }, { icon: Globe, v: "15+", l: "سوق عالمي" }].map(({ icon: Icon, v, l }) => (
              <div key={l} className="text-center">
                <Icon className="size-5 text-gold mx-auto mb-1" />
                <div className="text-3xl font-black text-gold font-mono">{v}</div>
                <div className="text-xs text-text-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-center text-4xl font-black text-foreground mb-16">قيمنا <span className="text-gradient-gold">الأساسية</span></h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-navy-mid p-8 text-center hover:border-gold hover:shadow-card transition-all">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold/10 border border-gold/20 text-gold"><v.icon className="size-7" /></div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-navy-mid">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-center text-4xl font-black text-foreground mb-16">رحلتنا عبر <span className="text-gradient-gold">السنوات</span></h2>
          <div className="flex flex-col gap-8">
            {timeline.map((t, i) => (
              <div key={t.year} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className={`flex-1 ${i % 2 === 1 ? "md:text-left" : "md:text-right"}`}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:border-gold transition-colors">
                    <div className="text-xs font-black text-gold tracking-widest">{t.year}</div>
                    <h3 className="mt-2 text-lg font-bold text-foreground">{t.title}</h3>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">{t.desc}</p>
                  </div>
                </div>
                <div className="relative shrink-0 z-10">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold shadow-gold text-white font-black text-sm border-4 border-white">{t.year.slice(2)}</div>
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-center text-4xl font-black text-foreground mb-4">فريق <span className="text-gradient-gold">القيادة</span></h2>
          <p className="text-center text-text-muted mb-16 text-lg">خبراء متمرسون يضعون مصلحتك أولاً</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-navy-mid p-8 text-center hover:border-gold hover:shadow-card transition-all">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-gold shadow-gold text-white font-black text-3xl">{m.ab}</div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{m.name}</h3>
                <p className="text-xs font-bold text-gold mt-1">{m.role}</p>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-gold text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-4xl font-black">ابدأ رحلتك الاستثمارية اليوم</h2>
          <p className="mt-4 opacity-90 text-lg">احجز استشارتك المجانية مع أحد خبرائنا المعتمدين</p>
          <a href="/contact" className="mt-8 inline-block rounded-xl bg-white text-gold font-black px-8 py-4 shadow-lg hover:-translate-y-1 transition-transform">تواصل معنا الآن</a>
        </div>
      </section>
    </div>
  );
}
