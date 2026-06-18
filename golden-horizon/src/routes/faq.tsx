import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export const Route = createFileRoute("/faq")({ component: Faq });

const faqs = [
  { cat: "البداية", q: "كيف أبدأ الاستثمار مع الثروة كابيتال كابيتال؟", a: "ابدأ بحجز استشارة مجانية عبر صفحة التواصل معنا. سيتواصل معك مستشارنا خلال 24 ساعة لتحديد أهدافك المالية ومستوى تحملك للمخاطر ثم نصمم معك محفظة استثمارية مخصصة." },
  { cat: "البداية", q: "ما الحد الأدنى للاستثمار؟", a: "يختلف الحد الأدنى حسب نوع الخدمة. خدمات إدارة المحافظ تبدأ من 50,000 ريال سعودي أو ما يعادلها، بينما تبدأ خدمات صناديق الاستثمار من 10,000 ريال. للتفاصيل الكاملة، تواصل مع فريقنا." },
  { cat: "البداية", q: "هل أنتم شركة مرخصة؟", a: "نعم، الثروة كابيتال كابيتال شركة مرخصة ومنظمة من قِبل هيئة الأوراق المالية في دولة الإمارات العربية المتحدة، وتخضع لأعلى معايير الامتثال والشفافية المالية الدولية." },
  { cat: "المحفظة", q: "كيف يتم اختيار الأصول في محفظتي؟", a: "يعتمد اختيار الأصول على خوارزميات الذكاء الاصطناعي المطورة داخلياً، مدعومة بخبرة فريقنا الذي يضم أكثر من 30 محللاً ماليًا معتمداً. يتم التحليل على 15 معياراً تشمل: الأداء التاريخي، الزخم، التقييم، ومستوى المخاطرة." },
  { cat: "المحفظة", q: "كم مرة تُراجع المحفظة؟", a: "نراجع المحفظة بشكل يومي تلقائياً، وتتم المراجعة الاستراتيجية شهرياً مع خبيرنا المعين لحسابك. وفي حالات تقلبات السوق الكبيرة، نتدخل فورياً لحماية أصولك." },
  { cat: "المحفظة", q: "هل يمكنني الوصول لمحفظتي في أي وقت؟", a: "نعم، يمكنك الوصول الكامل لبوابة العملاء على مدار الساعة 24/7 عبر الويب أو تطبيق الموبايل. تتضمن البوابة لوحة تحكم شاملة مع تقارير فورية وتفصيلية." },
  { cat: "الرسوم", q: "ما هيكل الرسوم لديكم؟", a: "نعتمد نموذج رسوم شفافاً: رسوم إدارة سنوية تتراوح بين 0.5% و1.5% حسب حجم المحفظة، إضافة إلى رسوم أداء 10% على الأرباح التي تتجاوز المعدل المرجعي. لا توجد رسوم إدخال أو إخراج خفية." },
  { cat: "الرسوم", q: "هل هناك رسوم إضافية على المعاملات؟", a: "لا. رسوم التداول والمعاملات مدمجة في رسوم الإدارة السنوية ولا تُحتسب بشكل منفصل. ستجد تفصيلاً كاملاً لجميع الرسوم في عقد الخدمة قبل أي التزام." },
  { cat: "المخاطر", q: "هل استثماراتي مؤمنة؟", a: "أصولك محفوظة في حسابات منفصلة لدى مصرف حاضن مرخص، ومؤمنة حتى 500,000 دولار وفقاً لأنظمة الجهة التنظيمية. كما نُطبق استراتيجيات تحوط متقدمة لتقليل المخاطر." },
  { cat: "المخاطر", q: "كيف تتعاملون مع تقلبات السوق؟", a: "نستخدم أنظمة stop-loss تلقائية، وتنويع جغرافي وقطاعي، واستراتيجيات التحوط بالمشتقات المالية. هدفنا دائماً تحقيق أفضل عائد مع الحفاظ على مستوى المخاطر المتفق عليه." },
  { cat: "السحب", q: "متى يمكنني سحب أموالي؟", a: "أموالك متاحة للسحب خلال 3-5 أيام عمل لمعظم الأصول. العملات الرقمية تُحوَّل خلال 24-48 ساعة. قد تختلف أوقات التسوية حسب نوع الأصل والسوق." },
  { cat: "السحب", q: "هل يوجد غرامة على السحب المبكر؟", a: "لا توجد غرامات على معظم الخدمات. لبعض صناديق الاستثمار المتخصصة، قد تنطبق فترة استثمار دنيا مدتها 6 أشهر. سيُوضح مستشارك كل التفاصيل قبل التسجيل." },
];

const cats = ["الكل", ...Array.from(new Set(faqs.map((f) => f.cat)))];

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("الكل");

  const filtered = faqs.filter((f) => {
    const matchCat = cat === "الكل" || f.cat === cat;
    const matchSearch = !search || f.q.includes(search) || f.a.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">الأسئلة الشائعة</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            الأسئلة <span className="text-gradient-gold">الشائعة</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            كل ما تريد معرفته عن خدماتنا الاستثمارية — بوضوح وشفافية تامة.
          </p>
          <div className="relative mt-8 max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الأسئلة..."
              className="w-full rounded-2xl border border-border bg-white py-4 pr-12 pl-5 text-sm shadow-card focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${cat === c ? "bg-gradient-gold text-white shadow-gold" : "border border-border bg-navy-mid text-text-muted hover:border-gold hover:text-gold"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={`rounded-2xl border transition-all ${isOpen ? "border-gold shadow-card" : "border-border"} bg-white overflow-hidden`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex items-center justify-between w-full px-6 py-5 text-right"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gold bg-gold/10 rounded-full px-2 py-0.5">{f.cat}</span>
                      <span className="font-bold text-foreground text-sm md:text-base">{f.q}</span>
                    </div>
                    <ChevronDown className={`size-5 text-gold shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="h-px bg-border mb-4" />
                      <p className="text-sm leading-relaxed text-text-muted">{f.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-text-muted">
                <div className="text-4xl mb-4">🔍</div>
                <p>لا توجد أسئلة مطابقة لبحثك</p>
              </div>
            )}
          </div>

          <div className="mt-16 rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
            <h3 className="text-xl font-black text-foreground">لم تجد إجابتك؟</h3>
            <p className="mt-2 text-text-muted">فريقنا جاهز للإجابة على أي استفسار خلال 24 ساعة</p>
            <a href="/contact" className="mt-5 inline-block rounded-xl bg-gradient-gold px-6 py-3 text-sm font-black text-white shadow-gold hover:-translate-y-0.5 transition-transform">
              تواصل معنا مباشرة
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
