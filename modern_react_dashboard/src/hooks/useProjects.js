/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

import { useEffect, useMemo, useState } from "react";
import { projectData } from "../data/projects.js";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProjects(projectData);
      setSelectedId(projectData[0]?.id ?? null);
      setIsLoading(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      const matchesQuery =
        normalisedQuery.length === 0 ||
        project.name.toLowerCase().includes(normalisedQuery) ||
        project.owner.toLowerCase().includes(normalisedQuery) ||
        project.category.toLowerCase().includes(normalisedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [projects, query, statusFilter]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? filteredProjects[0] ?? null,
    [projects, selectedId, filteredProjects]
  );

  function simulateError() {
    setError("The project service did not respond. This is a simulated error state.");
  }

  function clearError() {
    setError("");
  }

  return {
    projects,
    filteredProjects,
    selectedProject,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    selectedId,
    setSelectedId,
    isLoading,
    error,
    simulateError,
    clearError
  };
}
