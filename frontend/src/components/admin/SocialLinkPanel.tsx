import { useState, type FormEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { getDisplayText, getPlatformLabel } from "../../lib/social";
import { SocialIcon } from "../SocialIcon";
import type { SocialLink, SocialPlatform } from "../../types";

const PLATFORMS: SocialPlatform[] = [
  "GITHUB",
  "LINKEDIN",
  "UPWORK",
  "FIVERR",
  "FREELANCER",
  "FACEBOOK",
  "INSTAGRAM",
  "FASTWORK",
  "X",
  "BEHANCE",
  "DISCORD",
  "WEBSITE",
  "EMAIL",
  "OTHER",
];

export function SocialLinkPanel({ links, onChange }: { links: SocialLink[]; onChange: () => void }) {
  const { t } = useLanguage();
  const [platform, setPlatform] = useState<SocialPlatform>("GITHUB");
  const [url, setUrl] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/social-links", {
        platform,
        url,
        displayText: displayText || undefined,
        label: platform === "OTHER" ? label || undefined : undefined,
        order: links.length,
      });
      setUrl("");
      setDisplayText("");
      setLabel("");
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/social-links/${id}`);
    onChange();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = links[index + direction];
    const current = links[index];
    if (!target) return;
    await Promise.all([
      api.patch(`/social-links/${current.id}`, { order: target.order }),
      api.patch(`/social-links/${target.id}`, { order: current.order }),
    ]);
    onChange();
  };

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className="mb-4 flex flex-col gap-3 rounded-lg border border-slate bg-ink-2 p-4 sm:flex-row sm:items-end sm:flex-wrap"
      >
        <label className="block font-mono text-xs text-bone-dim">
          Platform
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
            className="mt-1 block rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="block flex-1 font-mono text-xs text-bone-dim">
          URL
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://…"
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
          />
        </label>

        <label className="block font-mono text-xs text-bone-dim">
          Display text
          <input
            value={displayText}
            onChange={(e) => setDisplayText(e.target.value)}
            placeholder="optional"
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
          />
        </label>

        {platform === "OTHER" && (
          <label className="block font-mono text-xs text-bone-dim">
            Label
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Dribbble"
              className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-marigold px-4 py-2 font-mono text-sm font-semibold text-ink disabled:opacity-60"
        >
          {saving ? t.admin.saving : t.admin.add}
        </button>
      </form>

      {error && <p className="mb-3 font-thai text-sm text-marigold">{error}</p>}

      {links.length === 0 ? (
        <p className="font-thai text-sm text-bone-dim">No social links yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate bg-ink-2">
          {links.map((link, i) => (
            <div
              key={link.id}
              className="flex items-center gap-3 border-b border-slate px-4 py-3 last:border-b-0"
            >
              <SocialIcon platform={link.platform} className="h-4 w-4 shrink-0 text-bone-dim" />
              <span className="w-24 shrink-0 font-mono text-xs uppercase text-bone-dim">
                {getPlatformLabel(link)}
              </span>
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm">
                {getDisplayText(link)}
              </span>
              <div className="flex shrink-0 gap-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded border border-slate px-2 py-1 text-bone-dim disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === links.length - 1}
                  className="rounded border border-slate px-2 py-1 text-bone-dim disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(link.id)}
                  className="rounded border border-slate px-2 py-1 text-bone-dim hover:text-marigold"
                >
                  {t.admin.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
