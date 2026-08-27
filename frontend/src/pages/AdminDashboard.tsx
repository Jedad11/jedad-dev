import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import { ProjectForm } from "../components/admin/ProjectForm";
import { ProjectAdminList } from "../components/admin/ProjectAdminList";
import { SocialLinkPanel } from "../components/admin/SocialLinkPanel";
import type { Project, SocialLink } from "../types";

export function AdminDashboard() {
  const { username, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadProjects = () => api.get<Project[]>("/projects").then(setProjects);
  const loadLinks = () => api.get<SocialLink[]>("/social-links").then(setLinks);

  useEffect(() => {
    loadProjects();
    loadLinks();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/mgmt-x7k2", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-slate pb-4">
        <div>
          <h1 className="font-mono text-lg font-semibold">{t.admin.dashboard}</h1>
          <p className="font-mono text-xs text-bone-dim">{username}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded border border-slate px-3 py-1.5 font-mono text-xs text-bone-dim hover:text-marigold"
        >
          {t.admin.logout}
        </button>
      </div>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-wider text-bone-dim">
            {t.admin.projectsPanel}
          </h2>
          {!showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="rounded bg-marigold px-3 py-1.5 font-mono text-xs font-semibold text-ink"
            >
              {t.admin.addProject}
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="mb-4">
            <ProjectForm
              onSaved={() => {
                setShowAddForm(false);
                loadProjects();
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <ProjectAdminList projects={projects} onChange={loadProjects} />
      </section>

      <section>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-bone-dim">
          {t.admin.socialPanel}
        </h2>
        <SocialLinkPanel links={links} onChange={loadLinks} />
      </section>
    </div>
  );
}
