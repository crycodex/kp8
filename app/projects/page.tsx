"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FolderPlus, Search } from "lucide-react";
import { fetchProjects } from "@/lib/api";
import { getProjectsFromStorage } from "@/lib/local-storage";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      setSuccessMessage("Proyecto creado exitosamente!");
      const t = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  useEffect(() => {
    const cached = getProjectsFromStorage();
    if (cached.length > 0) setProjects(cached);
    fetchProjects()
      .then(setProjects)
      .catch(() => setError("No se pudieron cargar los proyectos"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Proyectos
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tus proyectos y rastrea el progreso
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="/projects/new">
                <FolderPlus className="size-4" />
                Nuevo proyecto
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Buscar proyectos"
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Cargando proyectos...</p>
          </div>
        )}

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-center text-muted-foreground">
                {projects.length === 0
                  ? "No hay proyectos aún. Crea tu primer proyecto!"
                  : "No hay proyectos que coincidan con tu búsqueda."}
              </p>
              {projects.length === 0 && (
                <Button asChild className="mt-4">
                  <Link href="/projects/new">
                    <FolderPlus className="size-4" />
                    Nuevo proyecto
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {!loading && !error && filtered.length > 0 && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">{project.client}</TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(project.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/projects/${project.id}`}>Ver →</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
