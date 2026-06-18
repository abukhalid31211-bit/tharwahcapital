import { Link } from "@tanstack/react-router";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Shield, Award } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-gold/20 bg-navy-mid">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold shadow-gold">
              <span className="font-black text-white text-lg">ر</span>
            </div>
            <div className="leading-tight">
              <div className="font-black text-foreground">الثروة كابيتال كابيتال</div>
              <div className="text-[10px] tracking-widest text-gold uppercase">Rasekhoon Capital</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-text-muted">
            شركة استثمارية رائدة متخصصة في إدارة الثروات وتنويع المحافظ الاستثمارية
            في الأسواق العربية والعالمية بخبرة تمتد لأكثر من 15 عاماً.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Shield, label: "مرخص رسمياً" },
              { Icon: Award, label: "ISO 27001" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-lg border border-gold/20 bg-white px-2.5 py-1.5 text-[10px] font-bold text-text-muted">
                <Icon className="size-3 text-gold" />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2">
            {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid size-10 place-items-center rounded-lg border border-border bg-white text-text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Company links */}
        <div>
          <h4 className="text-sm font-black text-gold uppercase tracking-wider mb-5">الشركة</h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/about", l: "من نحن" },
              { to: "/services", l: "خدماتنا" },
              { to: "/markets", l: "الأسواق" },
              { to: "/news", l: "الأخبار والتحليلات" },
              { to: "/faq", l: "الأسئلة الشائعة" },
              { to: "/contact", l: "تواصل معنا" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-text-muted hover:text-gold transition-colors">
                  {item.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-sm font-black text-gold uppercase tracking-wider mb-5">خدماتنا</h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/service/gulf-stocks", l: "الأسهم الخليجية" },
              { to: "/service/global-stocks", l: "الأسهم العالمية" },
              { to: "/service/crypto", l: "العملات الرقمية" },
              { to: "/service/funds", l: "صناديق الاستثمار" },
              { to: "/service/metals", l: "المعادن والذهب" },
              { to: "/service/energy", l: "النفط والطاقة" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to as any} className="text-text-muted hover:text-gold transition-colors">
                  {item.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-black text-gold uppercase tracking-wider mb-5">تواصل معنا</h4>
          <ul className="space-y-4 text-sm text-text-muted">
            <li className="flex items-start gap-3">
              <MapPin className="size-4 text-gold mt-0.5 shrink-0" />
              <span>برج المركز المالي، شارع الشيخ زايد<br />دبي، الإمارات العربية المتحدة</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-gold shrink-0" />
              <a href="tel:+97141234567" className="font-mono hover:text-gold transition-colors">+971 4 123 4567</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-gold shrink-0" />
              <a href="mailto:info@rasekhoon.com" className="hover:text-gold transition-colors">info@rasekhoon.com</a>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-xs font-bold text-foreground mb-2">اشترك في نشرتنا الأسبوعية</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:border-gold focus:outline-none"
              />
              <button className="rounded-lg bg-gradient-gold px-3 py-2 text-sm font-bold text-white shadow-gold">
                ←
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} الثروة كابيتال كابيتال. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-gold transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-gold transition-colors">الشروط والأحكام</a>
            <a href="#" className="hover:text-gold transition-colors">الإفصاحات</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
