import { Shield, Award, Users, Clock, Lock, Zap } from "lucide-react";

const features = [
  { icon: Shield, t: "ترخيص رسمي", d: "مرخصون من هيئات رقابية معتمدة في الإمارات والسعودية." },
  { icon: Award, t: "خبرة 15+ سنة", d: "فريق محترف من المحللين والمستشارين الماليين الدوليين." },
  { icon: Users, t: "إدارة شخصية", d: "مستشار مالي مخصص لكل عميل بمتابعة دائمة وشخصية." },
  { icon: Clock, t: "دعم 24/7", d: "خدمة عملاء على مدار الساعة بالعربية والإنجليزية." },
  { icon: Lock, t: "أمان مؤسسي", d: "تشفير بنكي وحماية متعددة الطبقات لأصولك ومعلوماتك." },
  { icon: Zap, t: "تنفيذ فوري", d: "منصة تداول متقدمة بتنفيذ لحظي للصفقات في الأسواق العالمية." },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 bg-navy-mid/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">لماذا نحن</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-text-light">
            لماذا تختار <span className="text-gradient-gold">الثروة كابيتال كابيتال</span>
          </h2>
          <p className="mt-5 text-text-muted text-lg">قيمنا التي بنيناها على مدار سنوات من الثقة والاحترافية.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="flex gap-4 rounded-2xl border border-border bg-navy-dark/60 p-6 hover:border-gold/60 transition-colors">
              <div className="shrink-0 grid size-12 place-items-center rounded-xl bg-gold/15 text-gold">
                <f.icon className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-light">{f.t}</h3>
                <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
