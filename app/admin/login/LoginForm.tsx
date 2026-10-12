"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MoveRightIcon } from "lucide-react";
import { adminLoginSchema } from "@/shared/schemas/adminSchema";
import { ApiEnvelope } from "@/shared/types/api";
import { AdminLoginResponseData } from "@/app/api/admin/auth/login/route";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import { cn } from "@/utilities/cn";

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

      // No refresh needed here: the response above has already set the
      // auth cookie, so this navigation carries it and `proxy.ts` lets the
      // request through.
      router.replace(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field id="username" label="Username" error={errors.username?.message}>
        <input
          id="username"
          type="text"
          autoComplete="username"
          autoFocus
          aria-invalid={Boolean(errors.username)}
          className={cn("input", errors.username && "input-invalid")}
          {...register("username")}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          className={cn("input", errors.password && "input-invalid")}
          {...register("password")}
        />
      </Field>

      {error && (
        <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-small text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Signing in…" : "Sign in"}
        {!isSubmitting && <MoveRightIcon size={16} strokeWidth={1.5} />}
      </Button>
    </form>
  );
};

export default AdminLoginForm;