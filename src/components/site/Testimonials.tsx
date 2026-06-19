import { useState } from "react";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";

const items = [
  {
    name: "محمد أحمد الراشد",
    role: "رجل أعمال — الرياض",
    text: "تجربتي مع الثروة كابيتال كابيتال غيّرت نظرتي للاستثمار تماماً. الفريق محترف وشفافيتهم في التعامل والتقارير لا تُضاهى.",
  },
  {
    name: "د. سارة المنصوري",
    role: "طبيبة استشارية — دبي",
    text: "كنت أبحث عن جهة موثوقة لإدارة محفظتي. المستشار المخصص يفهم أهدافي ويتواصل معي باستمرار. النتائج فاقت توقعاتي.",
  },
  {
    name: "خالد بن سلمان",
    role: "مهندس بترول — الكويت",
    text: "احترافية في العمل وذكاء في اختيار الفرص الاستثمارية. أنصح بهم لكل من يبحث عن شراكة استثمارية حقيقية.",
  },
  {
    name: "نورة الزهراني",
    role: "مديرة مالية — جدة",
    text: "خدمة عملاء راقية وفهم عميق للأسواق الخليجية والعالمية. شعرت بالأمان منذ اليوم الأول.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);
  const next = () => setI((p) => (p + 1) % items.length);
  const t = items[i];
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">آراء العملاء</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-text-light">
            ماذا يقول <span className="text-gradient-gold">عملاؤنا</span>
          </h2>
        </div>

        <div className="relative rounded-3xl border border-gold/30 bg-gradient-to-br from-navy-mid to-navy-dark p-10 md:p-14 shadow-card">
          <div className="absolute -top-5 right-10 text-7xl text-gold/30 font-serif select-none">"</div>
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, n) => (
              <Star key={n} className="size-5 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-xl md:text-2xl leading-relaxed text-text-light font-medium">{t.text}</p>
          <div className="mt-8 flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-gradient-gold text-navy-dark font-black text-lg">
              {t.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-text-light">{t.name}</div>
              <div className="text-sm text-text-muted">{t.role}</div>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-navy-dark border border-border rounded-full px-3 py-2 shadow-card">
            <button onClick={prev} aria-label="السابق" className="grid size-9 place-items-center rounded-full hover:bg-navy-mid text-text-light">
              <ChevronRight className="size-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {items.map((_, n) => (
                <button
                  key={n}
                  onClick={() => setI(n)}
                  className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-gold" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="التالي" className="grid size-9 place-items-center rounded-full hover:bg-navy-mid text-text-light">
              <ChevronLeft className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
