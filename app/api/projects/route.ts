import { NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/store";
import type { CreateProjectInput } from "@/lib/types";

export async function GET(): Promise<NextResponse> {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json({ error: "Error al obtener los proyectos" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Partial<CreateProjectInput>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const client = typeof body.client === "string" ? body.client.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : undefined;
    const status = body.status ?? "PLANNED";

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "El nombre debe tener al menos 2 caracteres" }, { status: 400 });
    }
    if (!client || client.length < 2) {
      return NextResponse.json({ error: "El cliente debe tener al menos 2 caracteres" }, { status: 400 });
    }
    const validStatuses = ["PLANNED", "IN_PROGRESS", "DONE"];
    if (!validStatuses.includes(status)) {
          return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const project = await createProject({ name, client, status, description });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects]", error);
    return NextResponse.json({ error: "Error al crear el proyecto" }, { status: 500 });
  }
}
