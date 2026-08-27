import { useLanguage } from "../context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <div className="border-b border-slate py-10 sm:py-14">
      <h1 className="mb-3 font-mono text-2xl font-medium leading-snug sm:text-[30px]">
        <span className="text-jade">&gt;</span> {t.hero.prompt.replace("> ", "")}
        <span className="ml-1 inline-block h-4 w-2 translate-y-[3px] animate-blink bg-marigold align-middle" />
      </h1>
      <p className="max-w-xl font-thai text-sm leading-relaxed text-bone-dim sm:text-[15px]">
        {t.hero.lede}
      </p>
    </div>
  );
}
