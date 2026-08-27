import { Link } from "react-router-dom";
import type { Project } from "../types";
import { useLanguage } from "../context/LanguageContext";

export function ProjectRow({ project }: { project: Project }) {
  const { lang } = useLanguage();
  const title = lang === "th" ? project.titleTh : project.titleEn;
  const desc = lang === "th" ? project.descTh : project.descEn;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="mb-2.5 flex flex-col gap-1 rounded-lg border border-slate bg-ink-2 p-4 sm:flex-row sm:items-center sm:gap-4"
    >
      <span className="flex items-center gap-3 sm:contents">
        <span className="h-2 w-2 shrink-0 rounded-full bg-jade shadow-[0_0_6px_var(--color-jade)]" />
        <span className="min-w-[110px] text-[15px] font-semibold">{title}</span>
      </span>
      <span className="font-thai text-[13px] text-bone-dim sm:flex-1 sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap">
        {desc}
      </span>
      <span className="hidden text-bone-dim sm:inline">➤</span>
    </Link>
  );
}
