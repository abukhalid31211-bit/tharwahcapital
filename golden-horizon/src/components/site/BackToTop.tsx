import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
      className={`fixed bottom-24 left-6 z-50 grid size-12 place-items-center rounded-xl border border-gold/50 bg-white shadow-card text-gold transition-all duration-300 hover:bg-gold hover:text-white hover:shadow-gold hover:-translate-y-1 ${
        visible ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-3"
      }`}
    >
      <ChevronUp className="size-5" />
    </button>
  );
}
