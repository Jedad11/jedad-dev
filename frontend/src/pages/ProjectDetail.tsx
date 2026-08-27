import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Nav } from "../components/Nav";
import { ErrorState } from "../components/ErrorState";
import { useLanguage } from "../context/LanguageContext";
import { api, ApiError } from "../lib/api";
import type { Project, ProjectImage } from "../types";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "not-found" }
  | { status: "ready"; data: Project };

function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: ProjectImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 font-mono text-2xl text-bone-dim hover:text-marigold"
      >
        ×
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index - 1 + images.length) % images.length);
          }}
          aria-label="Previous image"
          className="absolute left-2 font-mono text-3xl text-bone-dim hover:text-marigold sm:left-6"
        >
          ‹
        </button>
      )}

      <img
        src={images[index].url}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] cursor-default rounded border border-slate object-contain"
      />

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index + 1) % images.length);
          }}
          aria-label="Next image"
          className="absolute right-2 font-mono text-3xl text-bone-dim hover:text-marigold sm:right-6"
        >
          ›
        </button>
      )}

      {images.length > 1 && (
        <p className="absolute bottom-4 font-mono text-xs text-bone-dim">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
                {state.data.images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="cursor-zoom-in"
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full rounded border border-slate object-cover"
                    />
                  </button>
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

      {state.status === "ready" && lightboxIndex !== null && (
        <Lightbox
          images={state.data.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
