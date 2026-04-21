"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppHeader from "../../../components/AppHeader";
import Loading from "../../../components/Loading";
import { apiRequest } from "../../../lib/api";
import { useRequireAuth } from "../../../lib/auth";

export default function ProjectDetailsPage() {
  const ready = useRequireAuth();
  const params = useParams();
  const projectId = params.projectId;

  const [project, setProject] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [apiKeyName, setApiKeyName] = useState("Development Key");
  const [plainApiKey, setPlainApiKey] = useState("");
  const [ruleForm, setRuleForm] = useState({
    route: "/login",
    limit: 5,
    windowSeconds: 60,
    identifierType: "ip"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProjectDetails() {
    const data = await apiRequest(`/api/projects/${projectId}`);
    setProject(data.project);
    setApiKeys(data.apiKeys);
    setRules(data.rules);
    setLogs(data.logs);
  }

  useEffect(() => {
    if (!ready || !projectId) return;

    loadProjectDetails().catch((err) => setError(err.message));
  }, [ready, projectId]);

  async function handleCreateApiKey(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPlainApiKey("");

    try {
      const data = await apiRequest(`/api/projects/${projectId}/api-keys`, {
        method: "POST",
        body: JSON.stringify({ name: apiKeyName })
      });

      // The backend only returns the real API key once. Show it clearly right away.
      setPlainApiKey(data.plainApiKey);
      setSuccess("API key created. Copy it now because it will not be shown again.");
      await loadProjectDetails();
    } catch (err) {
      setError(err.message);
    }
  }

  function updateRuleField(event) {
    const { name, value } = event.target;

    setRuleForm({
      ...ruleForm,
      [name]: name === "limit" || name === "windowSeconds" ? Number(value) : value
    });
  }

  async function handleCreateRule(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/api/projects/${projectId}/rules`, {
        method: "POST",
        body: JSON.stringify(ruleForm)
      });

      setSuccess("Rule created.");
      await loadProjectDetails();
    } catch (err) {
      setError(err.message);
    }
  }

  async function refreshLogs() {
    setError("");

    try {
      const data = await apiRequest(`/api/projects/${projectId}/logs`);
      setLogs(data.logs);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!ready || !project) return <Loading />;

  return (
    <div className="page">
      <AppHeader />

      <main className="container main stack">
        <div className="page-header">
          <div>
            <h1>{project.name}</h1>
            <p className="muted">{project.description || "Project details"}</p>
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <section className="panel stack">
          <h2>API keys</h2>

          <form className="form-grid" onSubmit={handleCreateApiKey}>
            <div className="field">
              <label htmlFor="apiKeyName">Key name</label>
              <input
                id="apiKeyName"
                value={apiKeyName}
                onChange={(event) => setApiKeyName(event.target.value)}
                required
              />
            </div>
            <button className="button" type="submit">
              Create API key
            </button>
          </form>

          {plainApiKey && (
            <div className="stack">
              <strong>Your new API key</strong>
              <div className="code-box">{plainApiKey}</div>
            </div>
          )}

          {apiKeys.length === 0 ? (
            <div className="empty">No API keys yet.</div>
          ) : (
            <div className="list">
              {apiKeys.map((key) => (
                <div className="list-item" key={key._id}>
                  <strong>{key.name}</strong>
                  <p className="muted">Prefix: {key.keyPrefix}</p>
                  <p className="muted">
                    Last used: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : "Never"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel stack">
          <h2>Rules</h2>

          <form className="form-grid" onSubmit={handleCreateRule}>
            <div className="field">
              <label htmlFor="route">Route</label>
              <input id="route" name="route" value={ruleForm.route} onChange={updateRuleField} required />
            </div>

            <div className="field">
              <label htmlFor="limit">Limit</label>
              <input
                id="limit"
                name="limit"
                type="number"
                min="1"
                value={ruleForm.limit}
                onChange={updateRuleField}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="windowSeconds">Window seconds</label>
              <input
                id="windowSeconds"
                name="windowSeconds"
                type="number"
                min="1"
                value={ruleForm.windowSeconds}
                onChange={updateRuleField}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="identifierType">Identifier type</label>
              <select
                id="identifierType"
                name="identifierType"
                value={ruleForm.identifierType}
                onChange={updateRuleField}
              >
                <option value="ip">IP</option>
                <option value="userId">User ID</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <button className="button" type="submit">
              Create rule
            </button>
          </form>

          {rules.length === 0 ? (
            <div className="empty">No rules yet.</div>
          ) : (
            <div className="list">
              {rules.map((rule) => (
                <div className="list-item" key={rule._id}>
                  <div className="list-item-header">
                    <div>
                      <strong>{rule.route}</strong>
                      <p className="muted">
                        {rule.limit} requests every {rule.windowSeconds} seconds by {rule.identifierType}
                      </p>
                    </div>
                    <span className="badge">Fixed window</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel stack">
          <div className="list-item-header">
            <h2>Recent logs</h2>
            <button className="button secondary" type="button" onClick={refreshLogs}>
              Refresh logs
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="empty">No request logs yet. Test /api/check-limit in Postman.</div>
          ) : (
            <div className="list">
              {logs.map((log) => (
                <div className="list-item" key={log._id}>
                  <div className="list-item-header">
                    <div>
                      <strong>{log.route}</strong>
                      <p className="muted">Identifier: {log.identifier}</p>
                      <p className="muted">
                        Remaining: {log.remaining} | Reset in: {log.resetIn}s
                      </p>
                      <p className="muted">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`badge ${log.allowed ? "allowed" : "blocked"}`}>
                      {log.allowed ? "Allowed" : "Blocked"}
                    </span>
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
