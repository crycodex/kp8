import type { Project } from "./types";

const STORAGE_KEY = "kp8-projects"; //despues agregar ev

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getProjectsFromStorage(): Project[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

export function saveProjectsToStorage(projects: Project[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Storage may be full or disabled
    console.error("Failed to save projects to storage");
  }
}
