import type { Project, CreateProjectInput } from "./types";
import { getProjectsFromStorage, saveProjectsToStorage } from "./local-storage";

const BASE = "/api/projects";

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Fallo al obtener los proyectos");
  const projects = (await res.json()) as Project[];
  saveProjectsToStorage(projects);
  return projects;
}

export async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Fallo al obtener el proyecto");
  return res.json();
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = (await res.json()) as Project | { error?: string };
  if (!res.ok) throw new Error((json as { error?: string }).error ?? "Failed to create project");
  const project = json as Project;
  const stored = getProjectsFromStorage();
  saveProjectsToStorage([...stored, project]);
  return project;
}

export async function updateProjectStatus(id: string, status: Project["status"]): Promise<Project> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const json = (await res.json()) as Project | { error?: string };
  if (!res.ok) throw new Error((json as { error?: string }).error ?? "Failed to update project");
  const project = json as Project;
  const stored = getProjectsFromStorage();
  const updated = stored.map((p) => (p.id === id ? project : p));
  saveProjectsToStorage(updated);
  return project;
}
