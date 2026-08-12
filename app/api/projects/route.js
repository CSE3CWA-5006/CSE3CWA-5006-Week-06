/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { NextResponse } from "next/server";
import { createProject, listProjects } from "../../../lib/services/projects.service.js";
import { publicError } from "../../../lib/errors.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const result = await listProjects(Object.fromEntries(url.searchParams.entries()));
    return NextResponse.json({ ok: true, data: result.items, meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }});
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message, details: result.details } }, { status: result.status });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const project = await createProject(body);
    return NextResponse.json({ ok: true, data: project }, { status: 201 });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message, details: result.details } }, { status: result.status });
  }
}
