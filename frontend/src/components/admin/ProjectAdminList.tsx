import { useState } from "react";
import { api } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { ProjectForm } from "./ProjectForm";
import type { Project } from "../../types";

export function ProjectAdminList({ projects, onChange }: { projects: Project[]; onChange: () => void }) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project? This also removes its images from Cloudinary.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/projects/${id}`);
      onChange();
    } finally {
      setDeletingId(null);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = projects[index + direction];
    const current = projects[index];
    if (!target) return;
    await Promise.all([
      api.patch(`/projects/${current.id}`, { order: target.order }),
      api.patch(`/projects/${target.id}`, { order: current.order }),
    ]);
    onChange();
  };

  if (projects.length === 0) {
    return <p className="font-thai text-sm text-bone-dim">No projects yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project, i) =>
        editingId === project.id ? (
          <ProjectForm
            key={project.id}
            project={project}
            onSaved={() => {
              setEditingId(null);
              onChange();
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={project.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate bg-ink-2 p-3"
          >
            <div>
              <p className="font-mono text-sm font-semibold">{project.titleEn}</p>
              <p className="font-thai text-xs text-bone-dim">{project.titleTh}</p>
            </div>
            <div className="flex shrink-0 gap-2 font-mono text-xs">
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
                disabled={i === projects.length - 1}
                className="rounded border border-slate px-2 py-1 text-bone-dim disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => setEditingId(project.id)}
                className="rounded border border-slate px-2.5 py-1 text-bone-dim hover:text-jade"
              >
                {t.admin.edit}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                className="rounded border border-slate px-2.5 py-1 text-bone-dim hover:text-marigold disabled:opacity-60"
              >
                {deletingId === project.id ? "…" : t.admin.delete}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
