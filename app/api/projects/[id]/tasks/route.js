/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { NextResponse } from "next/server";
import { createTask, listTasks } from "../../../../../lib/services/tasks.service.js";
import { publicError } from "../../../../../lib/errors.js";

export const dynamic = "force-dynamic";

async function projectIdFrom(context) {
  const params = await context.params;
  return Number(params.id);
}

export async function GET(_request, context) {
  try {
    const tasks = await listTasks(await projectIdFrom(context));
    return NextResponse.json({ ok: true, data: tasks });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message } }, { status: result.status });
  }
}

export async function POST(request, context) {
  try {
    const body = await request.json();
    const task = await createTask({ ...body, projectId: await projectIdFrom(context) });
    return NextResponse.json({ ok: true, data: task }, { status: 201 });
  } catch (error) {
    const result = publicError(error);
    return NextResponse.json({ ok: false, error: { message: result.message, details: result.details } }, { status: result.status });
  }
}
