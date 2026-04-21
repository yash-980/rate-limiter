"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading";
import { apiRequest } from "../../lib/api";
import { useRequireAuth } from "../../lib/auth";

export default function ProjectsPage() {
  const ready = useRequireAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadProjects() {
    const data = await apiRequest("/api/projects");
    setProjects(data.projects);
  }

  useEffect(() => {
    if (!ready) return;

    loadProjects().catch((err) => setError(err.message));
  }, [ready]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/api/projects", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm({ name: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return <Loading />;

  return (
    <div className="page">
      <AppHeader />

      <main className="container main stack">
        <div className="page-header">
          <div>
            <h1>Projects</h1>
            <p className="muted">Create one project for each app or API you want to protect.</p>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="two-column">
          <section className="panel stack">
            <h2>Create project</h2>

            <form className="form-grid" onSubmit={handleCreateProject}>
              <div className="field">
                <label htmlFor="name">Project name</label>
                <input id="name" name="name" value={form.name} onChange={updateField} required />
              </div>

              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                />
              </div>

              <button className="button" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create project"}
              </button>
            </form>
          </section>

          <section className="panel stack">
            <h2>Your projects</h2>

            {projects.length === 0 ? (
              <div className="empty">No projects yet.</div>
            ) : (
              <div className="list">
                {projects.map((project) => (
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
        </div>
      </main>
    </div>
  );
}
