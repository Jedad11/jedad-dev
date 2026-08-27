import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Nav } from "../components/Nav";
import { ErrorState } from "../components/ErrorState";
import { useLanguage } from "../context/LanguageContext";
import { api, ApiError } from "../lib/api";
import type { Project } from "../types";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "not-found" }
  | { status: "ready"; data: Project };

function DetailSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate bg-ink-2 p-6">
      <div className="mb-4 h-48 w-full rounded bg-slate sm:h-72" />
      <div className="mb-3 h-7 w-2/3 rounded bg-slate" />
      <div className="mb-2 h-4 w-full rounded bg-slate" />
      <div className="h-4 w-4/5 rounded bg-slate" />
    </div>
  );
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = () => {
    if (!id) return;
    setState({ status: "loading" });
    api
      .get<Project>(`/projects/${id}`)
      .then((data) => setState({ status: "ready", data }))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setState({ status: "not-found" });
        } else {
          setState({ status: "error" });
        }
      });
  };

  useEffect(load, [id]);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <Nav />

      <div className="py-8 sm:py-10">
        <Link to="/" className="mb-6 inline-block font-mono text-xs text-bone-dim hover:text-jade">
          ← {t.detail.back}
        </Link>

        {state.status === "loading" && <DetailSkeleton />}

        {state.status === "error" && (
          <ErrorState message={t.projects.error} retry={load} retryLabel={t.projects.retry} />
        )}

        {state.status === "not-found" && (
          <p className="font-thai text-sm text-bone-dim">{t.detail.notFound}</p>
        )}

        {state.status === "ready" && (
          <div className="rounded-lg border border-slate bg-ink-2 p-6">
            {state.data.images.length > 0 && (
              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                {state.data.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt=""
                    className="w-full rounded border border-slate object-cover"
                  />
                ))}
              </div>
            )}

            <h1 className="mb-3 font-mono text-xl font-semibold sm:text-2xl">
              {lang === "th" ? state.data.titleTh : state.data.titleEn}
            </h1>

            <p className="mb-5 whitespace-pre-line font-thai text-sm leading-relaxed text-bone-dim">
              {lang === "th" ? state.data.descTh : state.data.descEn}
            </p>

            {state.data.tags.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {state.data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate px-3 py-1 font-mono text-xs text-bone-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 font-mono text-sm">
              {state.data.liveUrl && (
                <a
                  href={state.data.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-marigold underline underline-offset-2"
                >
                  {t.detail.liveUrl} ↗
                </a>
              )}
              {state.data.githubUrl && (
                <a
                  href={state.data.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-jade underline underline-offset-2"
                >
                  {t.detail.githubUrl} ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
