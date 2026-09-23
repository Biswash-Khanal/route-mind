"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AdminLoginForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const body = await response.json();

      if (!response.ok || !body.success) {
        setError(body.message ?? "Login failed. Please try again.");
        return;
      }

      router.replace(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border rounded-md px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded-md px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="border text-sm px-10 py-2 rounded-md bg-ink text-paper disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default AdminLoginForm;