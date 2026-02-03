"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { fetchProject, updateProjectStatus } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

const STATUS_BADGE_VARIANTS: Record<Project["status"], string> = {
  PLANNED: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  DONE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
};

const STATUS_LABELS: Record<Project["status"], string> = {
  PLANNED: "Planificado",
  IN_PROGRESS: "En progreso",
  DONE: "Completado",
};

function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <Badge variant="secondary" className={cn("border-0", STATUS_BADGE_VARIANTS[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es", {
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
      .catch(() => setError("Proyecto no encontrado"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleMarkDone() {
    if (!project || project.status === "DONE") return;
    setUpdating(true);
    try {
      const updated = await updateProjectStatus(id, "DONE");
      setProject(updated);
    } catch {
      setError("No se pudo actualizar el proyecto");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Cargando proyecto...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <p className="text-muted-foreground">{error ?? "Proyecto no encontrado"}</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/projects">
            <ArrowLeft className="size-4" />
            Volver a proyectos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="size-4" />
              Volver a proyectos
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <CardDescription className="mt-1">{project.client}</CardDescription>
            </div>
            <StatusBadge status={project.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            {project.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Descripción</h3>
                <p className="whitespace-pre-wrap text-foreground">{project.description}</p>
              </div>
            )}

            <div className="grid gap-4 border-t pt-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Creado</h3>
                <p className="mt-1 text-foreground">{formatDate(project.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Última actualización</h3>
                <p className="mt-1 text-foreground">{formatDate(project.updatedAt)}</p>
              </div>
            </div>
          </CardContent>

          {project.status !== "DONE" && (
            <CardFooter className="border-t bg-muted/30">
              <Button
                onClick={handleMarkDone}
                disabled={updating}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                {updating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Marcar como Completado
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}
