import { MessageCircle } from "lucide-react";

export function WhatsappButton() {
  return (
    <a
      href="https://wa.me/97141234567"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl bg-[#25d366] px-5 py-3.5 text-white shadow-[0_8px_25px_rgba(37,211,102,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(37,211,102,0.7)] group animate-pulse-whatsapp"
    >
      <MessageCircle className="size-6 shrink-0" />
      <span className="font-bold text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
        تحدث معنا
      </span>
    </a>
  );
}
