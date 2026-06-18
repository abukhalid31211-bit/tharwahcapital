import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({ component: Contact });

type FormState = { name: string; email: string; phone: string; service: string; message: string };
const init: FormState = { name: "", email: "", phone: "", service: "", message: "" };
const services = ["الأسهم الخليجية", "الأسهم العالمية", "العملات الرقمية", "صناديق الاستثمار", "المعادن والذهب", "النفط والطاقة", "استشارة عامة"];

function Contact() {
  const [form, setForm] = useState<FormState>(init);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "بريد إلكتروني غير صالح";
    if (!form.message.trim()) e.message = "الرسالة مطلوبة";
    return e;
  };

  const handle = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center max-w-md animate-[successAppear_0.5s_ease]">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-gold shadow-gold text-white animate-[checkmark-pop_0.5s_ease]">
            <CheckCircle className="size-12" />
          </div>
          <h2 className="mt-8 text-3xl font-black text-foreground">تم إرسال رسالتك!</h2>
          <p className="mt-4 text-text-muted leading-relaxed">سيتواصل معك فريقنا خلال 24 ساعة على الأكثر. شكراً لاهتمامك بخدماتنا!</p>
          <button onClick={() => { setSubmitted(false); setForm(init); }} className="mt-8 rounded-xl bg-gradient-gold px-6 py-3 font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform">
            إرسال رسالة أخرى
          </button>
        </div>
      </div>
    );
  }

  const inputCls = (k: keyof FormState) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-foreground bg-white placeholder:text-text-muted focus:outline-none transition-colors ${errors[k] ? "border-down bg-red-50" : "border-border focus:border-gold"}`;

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">تواصل معنا</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            نحن هنا <span className="text-gradient-gold">لمساعدتك</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            فريقنا من الخبراء جاهز للرد على استفساراتك وتقديم الاستشارة المالية المناسبة لك.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1fr_1.5fr] gap-12">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-black text-foreground mb-8">معلومات التواصل</h2>
            <div className="flex flex-col gap-5">
              {[
                { icon: MapPin, title: "عنواننا", val: "برج المركز المالي، شارع الشيخ زايد، دبي، الإمارات" },
                { icon: Phone, title: "هاتف", val: "+971 4 123 4567" },
                { icon: Mail, title: "البريد الإلكتروني", val: "info@rasekhoon.com" },
                { icon: Clock, title: "ساعات العمل", val: "الأحد – الخميس: 9ص – 6م\nالجمعة: 9ص – 12م" },
              ].map(({ icon: Icon, title, val }) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-navy-mid p-5 hover:border-gold transition-colors">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold text-white">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gold uppercase tracking-wider">{title}</div>
                    <div className="mt-1 text-sm text-foreground whitespace-pre-line">{val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6">
              <h3 className="font-black text-foreground mb-2">⚡ استجابة سريعة</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                نرد على جميع الاستفسارات خلال <strong className="text-gold">24 ساعة</strong> أيام الأسبوع.
                للأمور العاجلة، اتصل بنا مباشرة أو راسلنا عبر الواتساب.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
            <h2 className="text-2xl font-black text-foreground mb-6">أرسل لنا رسالة</h2>
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">الاسم الكامل *</label>
                  <input value={form.name} onChange={handle("name")} placeholder="محمد العلي" className={inputCls("name")} />
                  {errors.name && <p className="mt-1 text-xs text-down">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">البريد الإلكتروني *</label>
                  <input type="email" value={form.email} onChange={handle("email")} placeholder="email@example.com" className={inputCls("email")} />
                  {errors.email && <p className="mt-1 text-xs text-down">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">رقم الهاتف</label>
                  <input value={form.phone} onChange={handle("phone")} placeholder="+971 50 123 4567" className={inputCls("phone")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">الخدمة المطلوبة</label>
                  <select value={form.service} onChange={handle("service")} className={inputCls("service")}>
                    <option value="">اختر الخدمة...</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">رسالتك *</label>
                <textarea value={form.message} onChange={handle("message")} rows={5} placeholder="أخبرنا عن أهدافك الاستثمارية..." className={inputCls("message") + " resize-none"} />
                {errors.message && <p className="mt-1 text-xs text-down">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-6 py-4 font-black text-white shadow-gold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
