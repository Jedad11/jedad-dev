import { useState, type FormEvent } from "react";
import { api, ApiError } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { TagInput } from "./TagInput";
import type { Project } from "../../types";

interface ImageDraft {
  url: string;
  publicId: string;
  order: number;
}

interface FormState {
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
  images: ImageDraft[];
}

function toFormState(project?: Project): FormState {
  if (!project) {
    return { titleTh: "", titleEn: "", descTh: "", descEn: "", liveUrl: "", githubUrl: "", tags: [], images: [] };
  }
  return {
    titleTh: project.titleTh,
    titleEn: project.titleEn,
    descTh: project.descTh,
    descEn: project.descEn,
    liveUrl: project.liveUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    tags: project.tags,
    images: project.images.map((img) => ({ url: img.url, publicId: img.publicId, order: img.order })),
  };
}

export function ProjectForm({
  project,
  onSaved,
  onCancel,
}: {
  project?: Project;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(() => toFormState(project));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(project);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: ImageDraft[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.postForm<{ url: string; publicId: string }>("/upload", formData);
        uploaded.push({ url: res.url, publicId: res.publicId, order: form.images.length + uploaded.length });
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (publicId: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img.publicId !== publicId) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const payload = {
      titleTh: form.titleTh,
      titleEn: form.titleEn,
      descTh: form.descTh,
      descEn: form.descEn,
      liveUrl: form.liveUrl,
      githubUrl: form.githubUrl,
      tags: form.tags,
      images: form.images.map((img, i) => ({ ...img, order: i })),
    };

    try {
      if (isEdit && project) {
        await api.patch(`/projects/${project.id}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate bg-ink-2 p-4 sm:p-5">
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block font-mono text-xs text-bone-dim">
          Title (TH)
          <input
            value={form.titleTh}
            onChange={(e) => setForm((f) => ({ ...f, titleTh: e.target.value }))}
            required
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-thai text-sm text-bone outline-none focus:border-jade"
          />
        </label>
        <label className="block font-mono text-xs text-bone-dim">
          Title (EN)
          <input
            value={form.titleEn}
            onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
            required
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-sans text-sm text-bone outline-none focus:border-jade"
          />
        </label>
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block font-mono text-xs text-bone-dim">
          Description (TH)
          <textarea
            value={form.descTh}
            onChange={(e) => setForm((f) => ({ ...f, descTh: e.target.value }))}
            required
            rows={4}
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-thai text-sm text-bone outline-none focus:border-jade"
          />
        </label>
        <label className="block font-mono text-xs text-bone-dim">
          Description (EN)
          <textarea
            value={form.descEn}
            onChange={(e) => setForm((f) => ({ ...f, descEn: e.target.value }))}
            required
            rows={4}
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-sans text-sm text-bone outline-none focus:border-jade"
          />
        </label>
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block font-mono text-xs text-bone-dim">
          Live URL
          <input
            value={form.liveUrl}
            onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
            placeholder="https://…"
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
          />
          {fieldErrors.liveUrl && <span className="text-marigold">{fieldErrors.liveUrl[0]}</span>}
        </label>
        <label className="block font-mono text-xs text-bone-dim">
          GitHub URL
          <input
            value={form.githubUrl}
            onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
            placeholder="https://github.com/…"
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
          />
          {fieldErrors.githubUrl && <span className="text-marigold">{fieldErrors.githubUrl[0]}</span>}
        </label>
      </div>

      <label className="mb-3 block font-mono text-xs text-bone-dim">
        Tags
        <div className="mt-1">
          <TagInput tags={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
        </div>
      </label>

      <div className="mb-4">
        <span className="mb-1 block font-mono text-xs text-bone-dim">Images</span>
        {form.images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {form.images.map((img) => (
              <div key={img.publicId} className="relative">
                <img src={img.url} alt="" className="h-16 w-16 rounded border border-slate object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.publicId)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-marigold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="font-mono text-xs text-bone-dim"
        />
        {uploading && <p className="mt-1 font-mono text-xs text-bone-dim">Uploading…</p>}
      </div>

      {error && <p className="mb-3 font-thai text-sm text-marigold">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded bg-marigold px-4 py-2 font-mono text-sm font-semibold text-ink disabled:opacity-60"
        >
          {saving ? t.admin.saving : t.admin.save}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate px-4 py-2 font-mono text-sm text-bone-dim"
          >
            {t.admin.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
