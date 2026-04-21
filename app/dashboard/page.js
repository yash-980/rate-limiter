"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading";
import { apiRequest } from "../../lib/api";
import { useRequireAuth } from "../../lib/auth";

export default function DashboardPage() {
  const ready = useRequireAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    async function loadProjects() {
      try {
        const data = await apiRequest("/api/projects");
        setProjects(data.projects);
      } catch (err) {
        setError(err.message);
      }
    }

    loadProjects();
  }, [ready]);

  if (!ready) return <Loading />;

  return (
    <div className="page">
      <AppHeader />

      <main className="container main stack">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">A quick overview of your rate limit projects.</p>
          </div>
          <Link className="button" href="/projects">
            Manage projects
          </Link>
        </div>

        {error && <p className="error">{error}</p>}

        <section className="grid">
          <div className="card">
            <h2>{projects.length}</h2>
            <p className="muted">Total projects</p>
          </div>
          <div className="card">
            <h2>JWT</h2>
            <p className="muted">Auth is stored in localStorage for this MVP.</p>
          </div>
          <div className="card">
            <h2>Fixed window</h2>
            <p className="muted">Redis counters power the rate limiter.</p>
          </div>
        </section>

        <section className="panel stack">
          <h2>Recent projects</h2>
          {projects.length === 0 ? (
            <div className="empty">No projects yet. Create your first project to begin.</div>
          ) : (
            <div className="list">
              {projects.slice(0, 5).map((project) => (
                <div className="list-item" key={project._id}>
                  <div className="list-item-header">
                    <div>
                      <strong>{project.name}</strong>
                      <p className="muted">{project.description || "No description"}</p>
                    </div>
                    <Link className="button secondary" href={`/projects/${project._id}`}>
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
