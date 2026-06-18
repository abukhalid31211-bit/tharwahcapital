import { Calendar, ArrowLeft, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";

const news = [
  {
    slug: "bitcoin-2025-outlook",
    cat: "عملات رقمية",
    title: "بيتكوين يسجل مستويات قياسية — ماذا يعني للمستثمر العربي؟",
    excerpt: "بعد ارتفاع 45% في الربع الأول، نحلل أفق سوق العملات الرقمية وما إذا كانت فرصة الشراء لا تزال قائمة.",
    date: "15 يونيو 2025",
    readTime: "8 دق",
    hot: true,
  },
  {
    slug: "gulf-stocks-q2",
    cat: "الأسهم الخليجية",
    title: "تحليل أداء أسواق الخليج في الربع الثاني",
    excerpt: "الفرص والمخاطر في أسواق السعودية وأبوظبي ودبي خلال الأشهر القادمة مع توقعات فريقنا.",
    date: "10 يونيو 2025",
    readTime: "12 دق",
    hot: false,
  },
  {
    slug: "gold-inflation-hedge",
    cat: "المعادن",
    title: "الذهب كسلاح ضد التضخم — هل حان وقت التراجع؟",
    excerpt: "نحلل دور الذهب في المحفظة الاستثمارية المتوازنة في ضوء بيانات التضخم الأخيرة.",
    date: "5 يونيو 2025",
    readTime: "6 دق",
    hot: false,
  },
];

export function LatestNews() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">المدونة</span>
            <h2 className="mt-2 text-4xl font-black text-foreground">آخر <span className="text-gradient-gold">التحليلات</span></h2>
          </div>
          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-gold hover:gap-3 transition-all">
            كل المقالات <ArrowLeft className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {news.map((n) => (
            <Link
              key={n.slug}
              to={`/article/${n.slug}` as any}
              className="group block rounded-2xl border border-border bg-navy-mid overflow-hidden hover:border-gold hover:shadow-card transition-all hover:-translate-y-1"
            >
              <div className="h-44 bg-gradient-navy flex items-center justify-center text-5xl">📰</div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {n.hot && <span className="text-[10px] font-black bg-down/10 text-down rounded-full px-2 py-0.5">🔥 رائج</span>}
                  <span className="text-[10px] font-black text-gold bg-gold/10 rounded-full px-2 py-0.5">{n.cat}</span>
                </div>
                <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-gold transition-colors">{n.title}</h3>
                <p className="mt-2 text-xs text-text-muted leading-relaxed line-clamp-2">{n.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Calendar className="size-3" />{n.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{n.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
