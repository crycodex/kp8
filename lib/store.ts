import type { Project } from "./types";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), ".data");
const DATA_FILE = join(DATA_DIR, "projects.json");

async function ensureDataDir(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory may already exist
    console.error("Fallo al crear el directorio de datos");
  }
}

async function readProjects(): Promise<Project[]> {
  await ensureDataDir();
  try {
    const content = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(content) as Project[];
  } catch {
    return [];
  }
}

async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataDir();
  try {
    await writeFile(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch {
    console.error("Fallo al escribir los proyectos en el archivo");
  }
}

export async function getAllProjects(): Promise<Project[]> {
  return readProjects();
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await readProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
  const projects = await readProjects();
  const now = new Date().toISOString();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  projects.push(newProject);
  await writeProjects(projects);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = await readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated = {
    ...projects[index],
    ...updates,
    id: projects[index].id,
    createdAt: projects[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  projects[index] = updated;
  await writeProjects(projects);
  return updated;
}
