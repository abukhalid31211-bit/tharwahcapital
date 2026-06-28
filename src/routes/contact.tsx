import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown, Search } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { submitContactMessage } from "../lib/api";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

export const Route = createFileRoute("/contact")({ component: Contact });

type FormState = { name: string; email: string; phone: string; service: string; message: string };
const init: FormState = { name: "", email: "", phone: "", service: "", message: "" };

const servicesAr = ["الأسهم الخليجية","الأسهم العالمية","العملات الرقمية","صناديق الاستثمار","المعادن والذهب","النفط والطاقة","استشارة عامة"];
const servicesEn = ["Gulf Equities","Global Equities","Cryptocurrencies","Investment Funds","Metals & Gold","Oil & Energy","General Consultation"];

const COUNTRIES = [
  { code: "SA", name: "السعودية", nameEn: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "AE", name: "الإمارات",  nameEn: "UAE",          dial: "+971", flag: "🇦🇪" },
  { code: "KW", name: "الكويت",   nameEn: "Kuwait",        dial: "+965", flag: "🇰🇼" },
  { code: "QA", name: "قطر",      nameEn: "Qatar",         dial: "+974", flag: "🇶🇦" },
  { code: "BH", name: "البحرين",  nameEn: "Bahrain",       dial: "+973", flag: "🇧🇭" },
  { code: "OM", name: "عُمان",    nameEn: "Oman",          dial: "+968", flag: "🇴🇲" },
  { code: "EG", name: "مصر",      nameEn: "Egypt",         dial: "+20",  flag: "🇪🇬" },
  { code: "JO", name: "الأردن",   nameEn: "Jordan",        dial: "+962", flag: "🇯🇴" },
  { code: "LB", name: "لبنان",    nameEn: "Lebanon",       dial: "+961", flag: "🇱🇧" },
  { code: "MA", name: "المغرب",   nameEn: "Morocco",       dial: "+212", flag: "🇲🇦" },
  { code: "TN", name: "تونس",     nameEn: "Tunisia",       dial: "+216", flag: "🇹🇳" },
  { code: "DZ", name: "الجزائر",  nameEn: "Algeria",       dial: "+213", flag: "🇩🇿" },
  { code: "IQ", name: "العراق",   nameEn: "Iraq",          dial: "+964", flag: "🇮🇶" },
  { code: "SD", name: "السودان",  nameEn: "Sudan",         dial: "+249", flag: "🇸🇩" },
  { code: "YE", name: "اليمن",    nameEn: "Yemen",         dial: "+967", flag: "🇾🇪" },
  { code: "LY", name: "ليبيا",    nameEn: "Libya",         dial: "+218", flag: "🇱🇾" },
  { code: "GB", name: "بريطانيا", nameEn: "UK",            dial: "+44",  flag: "🇬🇧" },
  { code: "US", name: "أمريكا",   nameEn: "USA",           dial: "+1",   flag: "🇺🇸" },
  { code: "DE", name: "ألمانيا",  nameEn: "Germany",       dial: "+49",  flag: "🇩🇪" },
  { code: "FR", name: "فرنسا",    nameEn: "France",        dial: "+33",  flag: "🇫🇷" },
  { code: "TR", name: "تركيا",    nameEn: "Turkey",        dial: "+90",  flag: "🇹🇷" },
  { code: "PK", name: "باكستان",  nameEn: "Pakistan",      dial: "+92",  flag: "🇵🇰" },
  { code: "IN", name: "الهند",    nameEn: "India",         dial: "+91",  flag: "🇮🇳" },
  { code: "CA", name: "كندا",     nameEn: "Canada",        dial: "+1",   flag: "🇨🇦" },
  { code: "AU", name: "أستراليا", nameEn: "Australia",     dial: "+61",  flag: "🇦🇺" },
];

function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [selected, setSelected] = useState(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(c =>
    c.name.includes(search) || c.nameEn.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  const handleNumChange = (num: string) => {
    setPhoneNum(num);
    onChange(num ? `${selected.dial} ${num}` : "");
  };

  const handleSelect = (c: typeof COUNTRIES[0]) => {
    setSelected(c);
    setOpen(false);
    setSearch("");
    if (phoneNum) onChange(`${c.dial} ${phoneNum}`);
  };

  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }} ref={dropRef}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 10px", background: "white", border: "1px solid #E2E8F0", borderRadius: "12px 0 0 12px", borderRight: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: "0.85rem", color: "#1E293B", minWidth: 90, flexShrink: 0 }}>
        <span style={{ fontSize: "1.1rem" }}>{selected.flag}</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#475569" }}>{selected.dial}</span>
        <ChevronDown size={12} color="#94A3B8" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>
      <input value={phoneNum} onChange={e => handleNumChange(e.target.value)} type="tel" placeholder="5x xxx xxxx"
        style={{ flex: 1, padding: "12px 12px", border: "1px solid #E2E8F0", borderRadius: "0 12px 12px 0", fontSize: "0.875rem", color: "#1E293B", outline: "none", fontFamily: "monospace", background: "white", minWidth: 0 }}
        onFocus={e => e.currentTarget.style.borderColor = "#C9A84C"}
        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 200, background: "white", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", width: 240, overflow: "hidden" }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 6 }}>
            <Search size={13} color="#94A3B8" />
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن الدولة..." dir="rtl"
              style={{ border: "none", outline: "none", fontSize: "0.8rem", flex: 1, fontFamily: "'Cairo',sans-serif", color: "#1E293B" }} />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.map(c => (
              <button key={c.code} type="button" onClick={() => handleSelect(c)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: selected.code === c.code ? "rgba(201,168,76,0.1)" : "transparent", border: "none", cursor: "pointer", textAlign: "right", fontFamily: "'Cairo',sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = selected.code === c.code ? "rgba(201,168,76,0.1)" : "transparent"}>
                <span style={{ fontSize: "1.1rem" }}>{c.flag}</span>
                <span style={{ flex: 1, fontSize: "0.82rem", color: "#1E293B", textAlign: "right" }}>{c.name}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#64748B" }}>{c.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && <div style={{ padding: "12px", textAlign: "center", color: "#94A3B8", fontSize: "0.8rem" }}>لا توجد نتائج</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function Contact() {
  const { t, lang } = useLang();
  const isAr = lang === "ar";
  const services = isAr ? servicesAr : servicesEn;

  const [form, setForm] = useState<FormState>(init);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { settings } = useSiteSettings();

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = t("contact_err_name");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("contact_err_email");
    if (!form.message.trim()) e.message = t("contact_err_message");
    return e;
  };

  const handle = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiError("");
    try {
      await submitContactMessage({ name: form.name, email: form.email, phone: form.phone, service: form.service, message: form.message, source: "contact" });
      setLoading(false); setSubmitted(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "حدث خطأ. يرجى المحاولة مجدداً.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-gold shadow-gold text-white">
            <CheckCircle className="size-12" />
          </div>
          <h2 className="mt-8 text-3xl font-black text-foreground">{t("contact_success_heading")}</h2>
          <p className="mt-4 text-text-muted leading-relaxed">{t("contact_success_desc")}</p>
          <button onClick={() => { setSubmitted(false); setForm(init); }} className="mt-8 rounded-xl bg-gradient-gold px-6 py-3 font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform">
            {t("contact_success_btn")}
          </button>
        </div>
      </div>
    );
  }

  const inputCls = (k: keyof FormState) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-foreground bg-white placeholder:text-text-muted focus:outline-none transition-colors ${errors[k] ? "border-down bg-red-50" : "border-border focus:border-gold"}`;

  const contactInfo = isAr ? [
    { icon: MapPin, title: "عنواننا", val: "برج المركز المالي، شارع الشيخ زايد، دبي، الإمارات" },
    { icon: Phone,  title: "هاتف",   val: "+971 4 123 4567" },
    { icon: Mail,   title: "البريد الإلكتروني", val: "info@tharwahcapital.com" },
    { icon: Clock,  title: "ساعات العمل", val: "الأحد – الخميس: 9ص – 6م\nالجمعة: 9ص – 12م" },
  ] : [
    { icon: MapPin, title: "Our Address",   val: "Financial Centre Tower, Sheikh Zayed Road, Dubai, UAE" },
    { icon: Phone,  title: "Phone",         val: "+971 4 123 4567" },
    { icon: Mail,   title: "Email",         val: "info@tharwahcapital.com" },
    { icon: Clock,  title: "Business Hours",val: "Sun – Thu: 9am – 6pm\nFri: 9am – 12pm" },
  ];

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">{t("contact_label")}</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            {t("contact_heading")} <span className="text-gradient-gold">{t("contact_heading_gold")}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">{t("contact_desc")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1fr_1.5fr] gap-12">
          <div>
            <h2 className="text-2xl font-black text-foreground mb-8">{t("contact_info_heading")}</h2>
            <div className="flex flex-col gap-5">
              {contactInfo.map(({ icon: Icon, title, val }) => (
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
              <h3 className="font-black text-foreground mb-2">{isAr ? "⚡ استجابة سريعة" : "⚡ Fast Response"}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? <> نرد على جميع الاستفسارات خلال <strong className="text-gold">24 ساعة</strong> أيام الأسبوع.</>
                  : <> We respond within <strong className="text-gold">24 hours</strong> on working days.</>}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
            <h2 className="text-2xl font-black text-foreground mb-6">{t("contact_form_heading")}</h2>
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">{t("contact_field_name")} *</label>
                  <input value={form.name} onChange={handle("name")} placeholder={t("contact_field_name_placeholder")} className={inputCls("name")} />
                  {errors.name && <p className="mt-1 text-xs text-down">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">{t("contact_field_email")} *</label>
                  <input type="email" value={form.email} onChange={handle("email")} placeholder="email@example.com" className={inputCls("email")} />
                  {errors.email && <p className="mt-1 text-xs text-down">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">
                    {t("contact_field_phone")} <span className="text-text-muted font-normal">{t("contact_optional")}</span>
                  </label>
                  <PhoneInput value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">{t("contact_field_service")}</label>
                  <select value={form.service} onChange={handle("service")} className={inputCls("service")}>
                    <option value="">{t("contact_field_service_default")}</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">{t("contact_field_message")} *</label>
                <textarea value={form.message} onChange={handle("message")} rows={5} placeholder={t("contact_field_message_placeholder")} className={inputCls("message") + " resize-none"} />
                {errors.message && <p className="mt-1 text-xs text-down">{errors.message}</p>}
              </div>

              {apiError && <div className="rounded-xl border border-down/30 bg-down/5 px-4 py-3 text-sm text-down font-semibold">⚠️ {apiError}</div>}

              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-6 py-4 font-black text-white shadow-gold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t("contact_sending")}</> : <><Send className="size-4" />{t("contact_submit")}</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}