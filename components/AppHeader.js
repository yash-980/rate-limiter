"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";

export default function AppHeader() {
  const router = useRouter();

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link className="brand" href="/dashboard">
          Rate Limit SaaS
        </Link>

        <nav className="nav">
          <Link className="button secondary" href="/dashboard">
            Dashboard
          </Link>
          <Link className="button secondary" href="/projects">
            Projects
          </Link>
          <button className="button danger" type="button" onClick={() => logout(router)}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
