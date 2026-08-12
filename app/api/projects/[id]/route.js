/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { NextResponse } from "next/server";
import { deleteProject, getProject, updateProject } from "../../../../lib/services/projects.service.js";
import { publicError } from "../../../../lib/errors.js";

export const dynamic = "force-dynamic";

async function idFrom(context) {
  const params = await context.params;
  return Number(params.id);
}

export async function GET(_request, context) {
  try {
    const project = await getProject(await idFrom(context));
    return NextResponse.json({ ok: true, data: project });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message } }, { status: result.status });
  }
}

export async function PATCH(request, context) {
  try {
    const project = await updateProject(await idFrom(context), await request.json());
    return NextResponse.json({ ok: true, data: project });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message, details: result.details } }, { status: result.status });
  }
}

export async function DELETE(_request, context) {
  try {
    const project = await deleteProject(await idFrom(context));
    return NextResponse.json({ ok: true, data: project });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message } }, { status: result.status });
  }
}
