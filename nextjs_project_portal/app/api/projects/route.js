import { NextResponse } from "next/server";
import { createProject, getProjects } from "../../../lib/projects";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({
    ok: true,
    data: projects
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const project = await createProject(body);

    return NextResponse.json(
      {
        ok: true,
        data: project
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: error.message
        }
      },
      { status: 400 }
    );
  }
}
