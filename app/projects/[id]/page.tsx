"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProject, updateProjectStatus } from "@/lib/api";
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
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProject(id)
      .then(setProject)
      .catch(() => setError("Project not found"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleMarkDone() {
    if (!project || project.status === "DONE") return;
    setUpdating(true);
    try {
      const updated = await updateProjectStatus(id, "DONE");
      setProject(updated);
    } catch {
      setError("Could not update project");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--accent) border-t-transparent" />
        <p className="mt-4 text-sm text-(--muted)">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <p className="text-(--muted)">{error ?? "Project not found"}</p>
        <Link
          href="/projects"
          className="mt-4 text-sm font-medium text-(--accent) hover:underline"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-(--border) bg-(--card)">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-(--muted) hover:text-foreground"
          >
            ← Back to projects
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-(--border) bg-(--card) shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {project.name}
                </h1>
                <p className="mt-1 text-(--muted)">{project.client}</p>
              </div>
              <StatusBadge status={project.status} />
            </div>

            {project.description && (
                <div className="mt-6 border-t border-(--border) pt-6">
                <h2 className="text-sm font-medium text-(--muted)">Description</h2>
                <p className="mt-2 text-foreground whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 border-t border-(--border) pt-6 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-medium text-(--muted)">Created</h2>
                <p className="mt-1 text-foreground">{formatDate(project.createdAt)}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-(--muted)">Last updated</h2>
                <p className="mt-1 text-foreground">{formatDate(project.updatedAt)}</p>
              </div>
            </div>
          </div>

          {project.status !== "DONE" && (
            <div className="border-t border-(--border) bg-background px-6 py-4 sm:px-8">
              <button
                onClick={handleMarkDone}
                disabled={updating}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70 sm:w-auto"
              >
                {updating ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  "Mark as Done"
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
