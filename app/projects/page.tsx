"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchProjects } from "@/lib/api";
import { getProjectsFromStorage } from "@/lib/local-storage";
import type { Project } from "@/lib/types";

function StatusBadge({ status }: { status: Project["status"] }) {
  const styles: Record<Project["status"], string> = {
    PLANNED: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
    DONE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  };
  const labels: Record<Project["status"], string> = {
    PLANNED: "Planned",
    IN_PROGRESS: "In progress",
    DONE: "Done",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "created") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccessMessage("Proyecto creado exitosamente!");
      const t = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  useEffect(() => {
    const cached = getProjectsFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached.length > 0) setProjects(cached);
    fetchProjects()
      .then(setProjects)
      .catch(() => setError("No se pudieron cargar los proyectos"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-(--border) bg-(--card)">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Projects
            </h1>
            <p className="mt-0.5 text-sm text-(--muted)">
              Manage your projects and track progress
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--accent-hover)"
          >
            <span aria-hidden>+</span> New project
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
            {successMessage}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="search"
              placeholder="Search by name or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-(--border) bg-(--card) py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-(--muted) focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-[var(--ac
              cent)/30"
              aria-label="Search projects"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--accent) border-t-transparent" />
            <p className="mt-4 text-sm text-(--muted)">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-(--border) bg-(--card) p-12 text-center">
            <p className="text-(--muted)">
              {projects.length === 0
                ? "No projects yet. Create your first one!"
                : "No projects match your search."}
            </p>
            {projects.length === 0 && (
              <Link
                href="/projects/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-medium text-white hover:bg-(--accent-hover)"
              >
                + New project
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-(--border) bg-(--card) shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-(--border)">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-(--muted)">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-(--muted)">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-(--muted)">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-(--muted)">
                      Updated
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-(--muted)">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border)">
                  {filtered.map((project) => (
                    <tr
                      key={project.id}
                      className="transition-colors hover:bg-background"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">
                          {project.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-(--muted)">
                        {project.client}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-(--muted)">
                        {formatDate(project.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-sm font-medium text-(--accent) hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--accent) border-t-transparent" />
        <p className="mt-4 text-sm text-(--muted)">Loading...</p>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
