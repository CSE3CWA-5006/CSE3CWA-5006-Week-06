"use server";

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
