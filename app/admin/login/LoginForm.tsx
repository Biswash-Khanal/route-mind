"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminLoginSchema } from "@/shared/schemas/adminSchema";
import { ApiEnvelope } from "@/shared/types/api";
import { AdminLoginResponseData } from "@/app/api/admin/auth/login/route";

// 2. Automatically generate the TypeScript type from the schema
type LoginFormData = z.infer<typeof adminLoginSchema>;

const AdminLoginForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // 3. Connect Zod to React Hook Form using the resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body: ApiEnvelope<AdminLoginResponseData> = await response.json();

      if (!response.ok || !body.success) {
        setError(body.message ?? "Login failed. Please try again.");
        return;
      }

      router.replace(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          className="border rounded-md px-3 py-2"
        />
        {/* 4. Display inline validation error if it exists */}
        {errors.username && (
          <p className="text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="border rounded-md px-3 py-2"
        />
        {/* 4. Display inline validation error if it exists */}
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
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
