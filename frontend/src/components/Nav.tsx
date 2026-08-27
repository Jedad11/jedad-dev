import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export function Nav() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center justify-between border-b border-slate py-4 sm:py-5.5">
      <Link to="/" className="font-mono text-sm font-medium sm:text-[15px]">
        jedad<span className="text-marigold">.dev</span>
      </Link>
      <div className="flex gap-0.5 rounded-full border border-slate bg-ink-2 p-1 font-mono text-xs font-medium sm:text-[13px]">
        <button
          type="button"
          onClick={() => setLang("th")}
          className={`rounded-full px-2.5 py-1 sm:px-3 ${
            lang === "th" ? "bg-marigold text-ink" : "text-bone-dim"
          }`}
        >
          TH
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`rounded-full px-2.5 py-1 sm:px-3 ${
            lang === "en" ? "bg-marigold text-ink" : "text-bone-dim"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
