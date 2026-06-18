import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, ArrowLeft, Search, Clock } from "lucide-react";

export const Route = createFileRoute("/news")({ component: News });

const articles = [
  {
    slug: "bitcoin-2025-outlook",
    cat: "عملات رقمية",
    title: "بيتكوين يسجل مستويات قياسية جديدة — ماذا يعني ذلك للمستثمرين العرب؟",
    excerpt: "بعد ارتفاع نسبته 45% خلال الربع الأول، يتساءل المستثمرون عن الأفق القادم لسوق العملات الرقمية وما إذا كانت فرصة الشراء لا تزال قائمة.",
    date: "15 يونيو 2025",
    readTime: "8 دقائق",
    author: "م. فيصل العمري",
    hot: true,
  },
  {
    slug: "gulf-stocks-q2",
    cat: "الأسهم الخليجية",
    title: "تحليل أداء أسواق الخليج في الربع الثاني — الفرص والمخاطر",
    excerpt: "يستعرض تقريرنا أداء أسواق الخليج في الربع الثاني مع التركيز على القطاعات الأكثر نمواً وتلك التي تُقدم فرصاً استثمارية واعدة.",
    date: "10 يونيو 2025",
    readTime: "12 دقائق",
    author: "د. سارة المطيري",
    hot: false,
  },
  {
    slug: "gold-inflation-hedge",
    cat: "المعادن",
    title: "الذهب كسلاح ضد التضخم — هل حان وقت التراجع؟",
    excerpt: "مع بيانات التضخم المتذبذبة والتوقعات المتباينة حول قرارات الفائدة، نحلل دور الذهب في المحفظة الاستثمارية المتوازنة.",
    date: "5 يونيو 2025",
    readTime: "6 دقائق",
    author: "م. خالد الحربي",
    hot: false,
  },
  {
    slug: "ai-stocks-2025",
    cat: "الأسهم العالمية",
    title: "أسهم الذكاء الاصطناعي في 2025 — بين الفرصة والمبالغة في التقييم",
    excerpt: "NVIDIA وMeta وGoogle تُسجل أرباحاً قياسية، لكن هل التقييمات الحالية مبررة؟ نقدم تحليلاً معمقاً لأبرز الأسهم التقنية.",
    date: "1 يونيو 2025",
    readTime: "10 دقائق",
    author: "م. أحمد الزهراني",
    hot: true,
  },
  {
    slug: "oil-prices-opec",
    cat: "الطاقة",
    title: "أسعار النفط بعد قرارات أوبك+ — ماذا يتوقع المحللون؟",
    excerpt: "بعد قرار أوبك+ بتمديد خفض الإنتاج، نستعرض توقعات أسعار النفط حتى نهاية العام والقطاعات المستفيدة.",
    date: "25 مايو 2025",
    readTime: "7 دقائق",
    author: "م. هند القحطاني",
    hot: false,
  },
  {
    slug: "portfolio-diversification",
    cat: "استراتيجية",
    title: "دليل تنويع المحفظة الاستثمارية للمستثمر العربي في 2025",
    excerpt: "كيف توزع أصولك بذكاء بين الأسهم والمعادن والعملات الرقمية؟ دليل عملي شامل مع أمثلة واقعية من السوق.",
    date: "20 مايو 2025",
    readTime: "15 دقائق",
    author: "د. سارة المطيري",
    hot: false,
  },
];

const cats = ["الكل", ...Array.from(new Set(articles.map((a) => a.cat)))];

function News() {
  const [cat, setCat] = useState("الكل");
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) => {
    const matchCat = cat === "الكل" || a.cat === cat;
    const matchSearch = !search || a.title.includes(search) || a.excerpt.includes(search);
    return matchCat && matchSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">المدونة والأخبار</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            تحليلات <span className="text-gradient-gold">وأخبار</span> الأسواق
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            آخر التحليلات والرؤى الاستثمارية من فريق خبرائنا المعتمدين.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${cat === c ? "bg-gradient-gold text-white shadow-gold" : "border border-border bg-navy-mid text-text-muted hover:border-gold hover:text-gold"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="relative sm:mr-auto">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث في المقالات..."
                className="rounded-xl border border-border bg-white py-2 pr-9 pl-4 text-sm focus:border-gold focus:outline-none w-56" />
            </div>
          </div>

          {/* Featured */}
          {featured && (
            <Link to={`/article/${featured.slug}` as any} className="block group mb-10">
              <div className="rounded-2xl border border-border bg-navy-mid overflow-hidden hover:border-gold hover:shadow-gold transition-all">
                <div className="h-56 bg-gradient-navy flex items-center justify-center">
                  <span className="text-7xl">📰</span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {featured.hot && <span className="text-[10px] font-black bg-down/10 text-down rounded-full px-2 py-0.5">🔥 رائج</span>}
                    <span className="text-[10px] font-black text-gold bg-gold/10 rounded-full px-2 py-0.5">{featured.cat}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted"><Calendar className="size-3" />{featured.date}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="size-3" />{featured.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-black text-foreground group-hover:text-gold transition-colors">{featured.title}</h2>
                  <p className="mt-3 text-text-muted leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-text-muted">بقلم {featured.author}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-gold group-hover:gap-3 transition-all">اقرأ المزيد <ArrowLeft className="size-4" /></span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <Link key={a.slug} to={`/article/${a.slug}` as any} className="group block rounded-2xl border border-border bg-navy-mid overflow-hidden hover:border-gold hover:shadow-card transition-all hover:-translate-y-1">
                <div className="h-44 bg-gradient-navy flex items-center justify-center text-4xl">📄</div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {a.hot && <span className="text-[10px] font-black bg-down/10 text-down rounded-full px-2 py-0.5">🔥</span>}
                    <span className="text-[10px] font-black text-gold bg-gold/10 rounded-full px-2 py-0.5">{a.cat}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="size-3" />{a.readTime}</span>
                  </div>
                  <h3 className="font-bold text-foreground leading-snug group-hover:text-gold transition-colors line-clamp-2">{a.title}</h3>
                  <p className="mt-2 text-xs text-text-muted leading-relaxed line-clamp-3">{a.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-text-muted">{a.author} · {a.date}</span>
                    <ArrowLeft className="size-4 text-gold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-muted"><div className="text-4xl mb-4">📭</div><p>لا توجد مقالات مطابقة</p></div>
          )}
        </div>
      </section>
    </div>
  );
}
