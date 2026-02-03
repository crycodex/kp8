"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/api";
import type { ProjectStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("PLANNED");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }
    if (!client.trim() || client.trim().length < 2) {
      errs.client = "Client must be at least 2 characters";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await createProject({ name: name.trim(), client: client.trim(), status, description: description.trim() || undefined });
      router.push("/projects?success=created");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const newLocal = "mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700";
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-(--border) bg-(--card)">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-(--muted) hover:text-foreground"
          >
            ← Back to projects
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            New project
          </h1>
          <p className="mt-1 text-sm text-(--muted)">
            Add a new project to your dashboard
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-(--border) bg-(--card) p-6 shadow-sm sm:p-8"
        >
          {error && (
            <div className={newLocal}>
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                Project name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: "" }));
                }}
                placeholder="e.g. Website redesign"
                className={`w-full rounded-lg border px-4 py-2.5 text-foreground placeholder:text-(--muted) focus:outline-none focus:ring-2 ${
                  fieldErrors.name
                    ? "border-red-500 focus:ring-red-500/30"
                    : "border-(--border) focus:ring-(--accent)/30"
                }`}
                autoFocus
                disabled={loading}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600 text-red
                -400">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="client" className="mb-1.5 block text-sm font-medium text-foreground">
                Client *
              </label>
              <input
                id="client"
                type="text"
                value={client}
                onChange={(e) => {
                  setClient(e.target.value);
                  if (fieldErrors.client) setFieldErrors((p) => ({ ...p, client: "" }));
                }}
                placeholder="e.g. Acme Corp"
                    className={`w-full rounded-lg border px-4 py-2.5 text-foreground placeholder:text-(--muted) focus:outline-none focus:ring-2 ${
                  fieldErrors.client
                    ? "border-red-500 focus:ring-red-500/30"
                    : "border-(--border) focus:ring-(--accent)/30"
                }`}
                disabled={loading}
              />
              {fieldErrors.client && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.client}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-foreground">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-lg border border-(--border) bg-background px-4 py-2.5 text-foreground focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/30"
                disabled={loading}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
                Description <span className="text-(--muted)">(optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project..."
                rows={4}
                className="w-full resize-none rounded-lg border border-(--border) px-4 py-2.5 text-foreground placeholder:text-(--muted) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/30"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/projects"
              className="order-2 inline-flex items-center justify-center rounded-lg border border-(--border) px-4 py-2.5 text-sm font-medium text-foreground hover:bg-background sm:order-1"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="order-1 inline-flex items-center justify-center rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--accent-hover) disabled:opacity-70 sm:order-2"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Create project"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
