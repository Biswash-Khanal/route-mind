"use client";

import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  async function logoutHandler() {
    const response = await fetch("/api/admin/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: null,
    });

    if (response.ok) {
      router.replace("/admin/login");
    }
  }

  return (
    <button
      onClick={logoutHandler}
      className="border text-sm px-10 py-2 rounded-md bg-ink text-paper"
    >
      Logout
    </button>
  );
};

export default LogoutButton;