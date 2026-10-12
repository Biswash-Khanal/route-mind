"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOutIcon } from "lucide-react";
import { cn } from "@/utilities/cn";

interface LogoutButtonProps {
  className?: string;
}

/**
 * Clears the auth cookie via the logout endpoint, then navigates.
 *
 * The `router.replace` is required, not cosmetic: the logout response clears
 * the cookie but the page under it was already rendered while authenticated, so
 * without a new request the stale admin view stays on screen.
 */
const LogoutButton = ({ className }: LogoutButtonProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logoutHandler() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: null,
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logoutHandler}
      disabled={isLoggingOut}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2",
        "text-small font-medium text-slate transition-colors",
        "hover:bg-mist hover:text-ink",
        className
      )}
    >
      <LogOutIcon size={16} strokeWidth={1.5} />
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
};

export default LogoutButton;