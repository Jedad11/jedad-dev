import type { SocialLink } from "../types";
import { SocialIcon } from "./SocialIcon";
import { getDisplayText, getPlatformLabel } from "../lib/social";
import { useLanguage } from "../context/LanguageContext";

export function ContactFooter({ links }: { links: SocialLink[] }) {
  const { t } = useLanguage();

  if (links.length === 0) return null;

  return (
    <footer className="mt-9 border-t border-slate py-8 pb-12 sm:pb-16">
      <div className="mb-3.5 font-mono text-xs uppercase tracking-wider text-bone-dim">
        {t.contact.label}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate bg-ink-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-1 border-b border-slate px-4 py-3 transition-colors last:border-b-0 hover:bg-jade/10 sm:flex-row sm:items-center sm:gap-3"
          >
            <span className="flex items-center gap-3">
              <span className="h-[18px] w-[18px] shrink-0 text-bone-dim">
                <SocialIcon platform={link.platform} className="h-full w-full" />
              </span>
              <span className="w-[92px] shrink-0 font-mono text-xs font-semibold uppercase tracking-wide text-bone-dim">
                {getPlatformLabel(link)}
              </span>
            </span>
            <span className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[13px] text-bone transition-colors group-hover:text-jade">
                {getDisplayText(link)}
              </span>
              <span className="shrink-0 -translate-x-1 font-mono text-[13px] text-jade opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                ➜
              </span>
            </span>
          </a>
        ))}
      </div>

      <p className="mt-5 font-mono text-xs text-bone-dim">
        © {new Date().getFullYear()} jedad.dev — built with React, Hono &amp; Prisma
      </p>
    </footer>
  );
}
