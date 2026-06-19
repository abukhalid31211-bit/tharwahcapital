import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft, Share2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/article/$slug")({ component: ArticleDetail });

const articles: Record<string, {
  cat: string; title: string; author: string; date: string; readTime: string;
  intro: string; body: string[];
}> = {
  "bitcoin-2025-outlook": {
    cat: "عملات رقمية", title: "بيتكوين يسجل مستويات قياسية — ماذا يعني ذلك للمستثمرين العرب؟",
    author: "م. فيصل العمري", date: "15 يونيو 2025", readTime: "8 دقائق",
    intro: "بعد ارتفاع نسبته 45% خلال الربع الأول من 2025، سجّل Bitcoin مستويات قياسية جديدة تجاوزت $70,000 للعملة الواحدة. هذا الارتفاع المتسارع يطرح تساؤلات جوهرية حول ما إذا كانت فرصة الدخول لا تزال قائمة للمستثمر العربي.",
    body: [
      "## ما الذي يقود هذا الارتفاع؟",
      "يرتكز الارتفاع الحالي على ثلاثة محركات رئيسية: أولاً، الموافقة على صناديق Bitcoin المتداولة في البورصة (ETF) من قِبل هيئة الأوراق المالية الأمريكية، مما فتح الباب أمام المستثمرين المؤسسيين للدخول. ثانياً، حدث التنصيف (Halving) في أبريل 2024 الذي خفّض المعروض الجديد إلى النصف. ثالثاً، تراجع حدة الضغوط التضخمية مما دفع المستثمرين نحو الأصول ذات المخاطر العالية.",
      "## هل لا تزال الفرصة قائمة؟",
      "يُشير المحللون إلى أن هذه الدورة تختلف جوهرياً عن السابقة، إذ يدخل اللاعبون المؤسسيون بشكل أكبر ويوفرون قدراً من الاستقرار. ومع ذلك، يظل Bitcoin أصلاً عالي المخاطر لا ينبغي أن يتجاوز 5-15% من المحفظة الإجمالية.",
      "## توصيتنا للمستثمر العربي",
      "ننصح بالدخول التدريجي عبر استراتيجية Dollar Cost Averaging بدلاً من الدخول الكامل دفعة واحدة. كما ننصح بتخصيص جزء محدود لا يتجاوز 10% من المحفظة للأصول الرقمية عند بدء الاستثمار.",
    ],
  },
  "gulf-stocks-q2": {
    cat: "الأسهم الخليجية", title: "تحليل أداء أسواق الخليج في الربع الثاني",
    author: "د. سارة المطيري", date: "10 يونيو 2025", readTime: "12 دقيقة",
    intro: "شهدت أسواق الخليج في الربع الثاني من 2025 أداءً متباياً بين القطاعات، مع نمو ملحوظ في قطاع التقنية المالية والطاقة المتجددة، في حين واجه قطاع العقارات ضغوطاً من ارتفاع أسعار الفائدة.",
    body: [
      "## القطاعات الأبرز أداءً",
      "تصدّر قطاع التقنية المالية (FinTech) قائمة الأفضل أداءً بعائد تجاوز 28%، مدفوعاً بتوسع شركات المدفوعات الرقمية في السوق السعودي. يليه قطاع الطاقة المتجددة بنمو 22%، بفضل ضخ الاستثمارات الحكومية الكبيرة في مشاريع الطاقة الشمسية وفق رؤية 2030.",
      "## القطاعات التي تحتاج مراقبة",
      "واجه قطاع العقارات تحديات من ارتفاع تكاليف التمويل رغم الطلب القوي. ونوصي بالحذر في هذا القطاع والتركيز على شركات التطوير ذات الميزانيات القوية والسيولة الكافية.",
      "## توقعات الربع الثالث",
      "نتوقع استمرار الزخم الإيجابي في قطاعَي التقنية والطاقة، مع احتمال انتعاش تدريجي لقطاع العقارات إذا تحققت توقعات خفض أسعار الفائدة.",
    ],
  },
  "gold-inflation-hedge": {
    cat: "المعادن", title: "الذهب كسلاح ضد التضخم — هل حان وقت التراجع؟",
    author: "م. خالد الحربي", date: "5 يونيو 2025", readTime: "6 دقائق",
    intro: "مع تراجع مؤشرات التضخم تدريجياً في الاقتصادات الكبرى، يتساءل المستثمرون: هل لا يزال الذهب الملاذ الأمثل؟ وهل حان وقت تخفيض التعرض لهذا المعدن النفيس؟",
    body: [
      "## الذهب والتضخم: العلاقة التاريخية",
      "تاريخياً، يُحتفظ بالذهب كتحوط ضد التضخم وانخفاض قيمة العملات. في السنوات الثلاث الماضية، أثبت الذهب فعاليته إذ ارتفع أكثر من 40% بينما كانت التضخمات تضرب الاقتصادات الغربية.",
      "## الوضع الراهن",
      "مع انخفاض التضخم ببطء نحو المستهدفات المركزية (2-3%)، يرى بعض المحللين أن الجزء الأكبر من أداء الذهب قد تحقق. لكن المخاوف الجيوسياسية وضعف الدولار يبقيان الطلب على الذهب مرتفعاً.",
      "## توصيتنا",
      "ننصح بالإبقاء على تخصيص 8-12% للذهب في المحفظة المتوازنة كوقاية استراتيجية، مع تجنب الزيادة عن هذه النسبة في الظروف الراهنة.",
    ],
  },
};

function ArticleDetail() {
  const { slug } = Route.useParams();
  const article = articles[slug];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 gap-6">
        <div className="text-7xl">📭</div>
        <h1 className="text-3xl font-black text-foreground">المقال غير موجود</h1>
        <Link to="/news" className="rounded-xl bg-gradient-gold px-6 py-3 font-bold text-white shadow-gold">العودة إلى الأخبار</Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors mb-6">
            <ArrowLeft className="size-4 rotate-180" /> العودة إلى الأخبار
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-black text-gold bg-gold/10 rounded-full px-3 py-1">{article.cat}</span>
            <span className="flex items-center gap-1 text-xs text-text-muted"><Calendar className="size-3" />{article.date}</span>
            <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="size-3" />{article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">{article.title}</h1>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-gradient-gold text-white font-black">
                {article.author.charAt(3)}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{article.author}</div>
                <div className="text-xs text-text-muted">محلل مالي معتمد</div>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors border border-border rounded-xl px-4 py-2">
              <Share2 className="size-4" /> مشاركة
            </button>
          </div>
        </div>
      </section>

      {/* Reading progress */}
      <div className="reading-progress"><div className="reading-progress-fill" style={{ width: "30%" }} /></div>

      {/* Content */}
      <article className="py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 mb-10">
            <div className="flex items-start gap-3">
              <BookOpen className="size-5 text-gold mt-0.5 shrink-0" />
              <p className="text-base leading-relaxed text-foreground font-semibold">{article.intro}</p>
            </div>
          </div>

          <div className="prose-content text-foreground text-[15px] leading-loose">
            {article.body.map((section, i) => {
              if (section.startsWith("## ")) {
                return <h2 key={i} className="text-xl font-black text-foreground mt-10 mb-4 text-gradient-gold">{section.replace("## ", "")}</h2>;
              }
              return <p key={i} className="mb-5 text-text-muted leading-loose">{section}</p>;
            })}
          </div>

          <div className="mt-16 rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
            <h3 className="text-xl font-black text-foreground">هل تريد تطبيق هذه الرؤى على محفظتك؟</h3>
            <p className="mt-2 text-text-muted">خبراؤنا جاهزون لمساعدتك في بناء استراتيجية استثمارية متكاملة</p>
            <Link to="/contact" className="mt-5 inline-block rounded-xl bg-gradient-gold px-6 py-3 font-black text-white shadow-gold hover:-translate-y-0.5 transition-transform">
              احجز استشارة مجانية
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
