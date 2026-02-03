export type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "DONE";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  client: string;
  status?: ProjectStatus;
  description?: string;
}
