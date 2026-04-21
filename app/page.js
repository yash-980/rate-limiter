import Link from "next/link";

export default function HomePage() {
  return (
    <main className="auth-shell">
      <section className="auth-card stack">
        <div>
          <h1>Rate Limit SaaS</h1>
          <p className="muted">
            Create projects, generate API keys, define rules, and track rate limit logs.
          </p>
        </div>

        <div className="stack">
          <Link className="button" href="/signup">
            Create account
          </Link>
          <Link className="button secondary" href="/login">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
