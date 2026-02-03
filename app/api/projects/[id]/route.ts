import { NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/lib/store";
import type { Project, ProjectStatus } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string }> };

const VALID_STATUSES: ProjectStatus[] = ["PLANNED", "IN_PROGRESS", "DONE"];

export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("[GET /api/projects/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const updates: Partial<Project> = {};
    if (typeof body.status === "string" && VALID_STATUSES.includes(body.status as ProjectStatus)) {
      updates.status = body.status as ProjectStatus;
    }
    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      updates.name = body.name.trim();
    }
    if (typeof body.client === "string" && body.client.trim().length >= 2) {
      updates.client = body.client.trim();
    }
    if (body.description !== undefined) {
      updates.description = typeof body.description === "string" ? body.description.trim() : undefined;
    }

    const project = await updateProject(id, updates);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("[PATCH /api/projects/[id]]", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
