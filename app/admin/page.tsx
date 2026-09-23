"use client";

import Link from "next/link";
import { useState } from "react";

const AdminDashboardPage = () => {
  const [logoutResponse, setLogoutResponse] = useState<any>(null);

  async function logoutHandler() {
    const response = await fetch("/api/admin/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: null,
    });

    setLogoutResponse(response);

    console.log(logoutResponse);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <nav className="flex gap-4">
        <Link
          href="/admin/account"
          className="border text-sm px-10 py-2 rounded-md bg-ink text-paper"
        >
          Account Details
        </Link>
        <Link
          href="/admin/admins"
          className="border text-sm px-10 py-2 rounded-md bg-ink text-paper"
        >
          Manage Admins
        </Link>
        <button
          onClick={logoutHandler}
          className="border text-sm px-10 py-2 rounded-md bg-ink text-paper"
        >
          Manage Admins
        </button>
      </nav>
    </div>
  );
};

export default AdminDashboardPage;
