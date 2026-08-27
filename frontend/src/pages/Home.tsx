import { useEffect, useState } from "react";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { ProjectRow } from "../components/ProjectRow";
import { ProjectRowSkeleton } from "../components/ProjectRowSkeleton";
import { ErrorState } from "../components/ErrorState";
import { ContactFooter } from "../components/ContactFooter";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import type { Project, SocialLink } from "../types";

type LoadState<T> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: T };

export function Home() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<LoadState<Project[]>>({ status: "loading" });
  const [links, setLinks] = useState<SocialLink[]>([]);

  const loadProjects = () => {
    setProjects({ status: "loading" });
    api
      .get<Project[]>("/projects")
      .then((data) => setProjects({ status: "ready", data }))
      .catch(() => setProjects({ status: "error" }));
  };

  useEffect(() => {
    loadProjects();
    api
      .get<SocialLink[]>("/social-links")
      .then(setLinks)
      .catch(() => setLinks([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <Nav />
      <Hero />

      <div className="mb-3.5 mt-9 font-mono text-xs uppercase tracking-wider text-bone-dim">
        {t.projects.label}
      </div>

      {projects.status === "loading" && (
        <>
          <ProjectRowSkeleton />
          <ProjectRowSkeleton />
          <ProjectRowSkeleton />
        </>
      )}

      {projects.status === "error" && (
        <ErrorState message={t.projects.error} retry={loadProjects} retryLabel={t.projects.retry} />
      )}

      {projects.status === "ready" && projects.data.length === 0 && (
        <p className="font-thai text-sm text-bone-dim">{t.projects.empty}</p>
      )}

      {projects.status === "ready" &&
        projects.data.map((project) => <ProjectRow key={project.id} project={project} />)}

      <ContactFooter links={links} />
    </div>
  );
}
