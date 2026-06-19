import { Phone, ClipboardList, Briefcase, LineChart } from "lucide-react";

const steps = [
  { icon: Phone, t: "تواصل معنا", d: "حدد موعد استشارة مجانية مع أحد مستشارينا الماليين." },
  { icon: ClipboardList, t: "دراسة احتياجاتك", d: "نحلل أهدافك المالية وقدرتك على تحمل المخاطر بدقة." },
  { icon: Briefcase, t: "وضع الخطة", d: "نصمم محفظة استثمارية مخصصة تلائم تطلعاتك بالضبط." },
  { icon: LineChart, t: "متابعة وتقارير", d: "تقارير دورية مفصلة ومتابعة لحظية لأداء استثماراتك." },
];

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 bg-navy-mid/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">العملية</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-text-light">
            كيف تعمل <span className="text-gradient-gold">معنا؟</span>
          </h2>
          <p className="mt-5 text-text-muted text-lg">أربع خطوات بسيطة تفصلك عن بداية رحلتك الاستثمارية معنا.</p>
        </div>

        <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="hidden lg:block absolute top-7 right-[12.5%] left-[12.5%] h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
          {steps.map((s, i) => (
            <div key={s.t} className="relative text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-gradient-gold text-navy-dark font-black text-lg shadow-gold relative z-10">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-5 mx-auto grid size-12 place-items-center rounded-xl bg-navy-dark border border-border text-gold">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-text-light">{s.t}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
