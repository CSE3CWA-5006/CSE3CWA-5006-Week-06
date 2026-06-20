import { projects } from "../data/projects.data.js";

let nextId = Math.max(...projects.map((project) => project.id)) + 1;

export function findProjects({ status, category, search, sortBy = "id", order = "asc", page = 1, limit = 10 }) {
  let result = [...projects];

  if (status) {
    result = result.filter((project) => project.status === status);
  }

  if (category) {
    result = result.filter((project) => project.category === category);
  }

  if (search) {
    const normalisedSearch = search.toLowerCase();
    result = result.filter(
      (project) =>
        project.name.toLowerCase().includes(normalisedSearch) ||
        project.owner.toLowerCase().includes(normalisedSearch) ||
        project.category.toLowerCase().includes(normalisedSearch)
    );
  }

  result.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });

  const total = result.length;
  const start = (page - 1) * limit;
  const paged = result.slice(start, start + limit);

  return {
    items: paged,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

export function findProjectById(id) {
  return projects.find((project) => project.id === Number(id)) ?? null;
}

export function createProject(input) {
  const project = {
    id: nextId,
    ...input
  };
  nextId += 1;
  projects.push(project);
  return project;
}

export function updateProject(id, input) {
  const index = projects.findIndex((project) => project.id === Number(id));
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...input
  };
  return projects[index];
}

export function deleteProject(id) {
  const index = projects.findIndex((project) => project.id === Number(id));
  if (index === -1) return null;

  const [deleted] = projects.splice(index, 1);
  return deleted;
}
