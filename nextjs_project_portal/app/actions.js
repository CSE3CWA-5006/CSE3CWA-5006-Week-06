"use server";

/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

import { revalidatePath } from "next/cache";
import { createProject } from "../lib/projects";

export async function createProjectAction(previousState, formData) {
  try {
    await createProject({
      title: formData.get("title"),
      owner: formData.get("owner"),
      status: formData.get("status"),
      priority: formData.get("priority")
    });

    revalidatePath("/");

    return {
      ok: true,
      message: "Project created. The server rendered the updated project list."
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message
    };
  }
}
