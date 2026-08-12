/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { NextResponse } from "next/server";
import { deleteTask, updateTask } from "../../../../lib/services/tasks.service.js";
import { publicError } from "../../../../lib/errors.js";

export const dynamic = "force-dynamic";

async function idFrom(context) {
  const params = await context.params;
  return Number(params.id);
}

export async function PATCH(request, context) {
  try {
    const task = await updateTask(await idFrom(context), await request.json());
    return NextResponse.json({ ok: true, data: task });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message, details: result.details } }, { status: result.status });
  }
}

export async function DELETE(_request, context) {
  try {
    const task = await deleteTask(await idFrom(context));
    return NextResponse.json({ ok: true, data: task });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message } }, { status: result.status });
  }
}
