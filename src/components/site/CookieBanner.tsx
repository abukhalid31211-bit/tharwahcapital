import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies-accepted");
    if (!accepted) setTimeout(() => setVisible(true), 1500);
  }, []);

  const accept = () => {
    localStorage.setItem("cookies-accepted", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9998] border-t border-gold/30 bg-white/98 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] animate-[fade-up_0.5s_ease]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Cookie className="size-5 text-gold shrink-0" />
          <p className="text-sm text-text-muted">
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك.{" "}
            <a href="#" className="text-gold font-bold hover:underline">
              سياسة الخصوصية
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setVisible(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:border-gold hover:text-gold transition-colors"
          >
            الإعدادات
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-gradient-gold px-5 py-2 text-sm font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform"
          >
            قبول الكل
          </button>
        </div>
      </div>
    </div>
  );
}
