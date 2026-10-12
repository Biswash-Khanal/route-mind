"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react";
import Card, { CardTitle } from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import { cn } from "@/utilities/cn";
import {
  adminChangePasswordSchema,
  adminChangeUsernameSchema,
} from "@/shared/schemas/adminSchema";
import { CURRENT_ADMIN } from "@/shared/mock/admins";
import { ApiEnvelope } from "@/shared/types/api";

type UsernameFormData = z.infer<typeof adminChangeUsernameSchema>;
type PasswordFormData = z.infer<typeof adminChangePasswordSchema>;

type Feedback = { tone: "success" | "error"; message: string } | null;

const FEEDBACK_STYLE = {
  success: { Icon: CheckCircle2Icon, className: "text-walk-500" },
  error: { Icon: XCircleIcon, className: "text-danger" },
} as const;

/** Inline result banner. Errors get `role="alert"` so they are announced. */
const FeedbackBanner = ({ feedback }: { feedback: Feedback }) => {
  if (!feedback) return null;

  const { Icon, className } = FEEDBACK_STYLE[feedback.tone];

  return (
    <p
      role={feedback.tone === "error" ? "alert" : "status"}
      className="flex items-start gap-2 text-caption"
    >
      <Icon size={14} strokeWidth={1.75} className={cn("mt-px shrink-0", className)} />
      <span className={feedback.tone === "error" ? "text-danger" : "text-ink"}>
        {feedback.message}
      </span>
    </p>
  );
};

/**
 * Self-service account forms.
 *
 * Unlike the rest of the admin screens these two talk to the real API —
 * `PATCH /api/admin/me/username` and `POST /api/admin/me/password` are both
 * implemented server-side, so wiring them is free and gives genuinely working
 * behaviour. Each field is validated client-side with the same Zod schema the
 * route handler uses, so the two can never disagree about what is valid.
 */
const AccountForms = () => {
  const router = useRouter();
  const [usernameFeedback, setUsernameFeedback] = useState<Feedback>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null);

  const {
    register: registerUsername,
    handleSubmit: submitUsername,
    reset: resetUsername,
    formState: { errors: usernameErrors, isSubmitting: isSavingUsername },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(adminChangeUsernameSchema),
    defaultValues: { username: CURRENT_ADMIN.username },
  });

  const {
    register: registerPassword,
    handleSubmit: submitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSavingPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(adminChangePasswordSchema),
  });

  async function onChangeUsername(data: UsernameFormData) {
    setUsernameFeedback(null);

    try {
      const response = await fetch("/api/admin/me/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body: ApiEnvelope<unknown> = await response.json();

      if (!response.ok || !body.success) {
        setUsernameFeedback({
          tone: "error",
          message: body.message ?? "Could not change your username.",
        });
        return;
      }

      setUsernameFeedback({
        tone: "success",
        message: `Username updated to @${data.username}.`,
      });
    } catch {
      setUsernameFeedback({
        tone: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  async function onChangePassword(data: PasswordFormData) {
    setPasswordFeedback(null);

    try {
      const response = await fetch("/api/admin/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body: ApiEnvelope<unknown> = await response.json();

      if (!response.ok || !body.success) {
        setPasswordFeedback({
          tone: "error",
          message: body.message ?? "Could not change your password.",
        });
        return;
      }

      setPasswordFeedback({
        tone: "success",
        message: "Password changed. Taking you to the sign-in page…",
      });
      resetPassword();

      // This endpoint also clears the auth cookie, so the current session is no
      // longer valid. A new request is required to drop the stale admin view.
      setTimeout(() => {
        router.replace("/admin/login");
        router.refresh();
      }, 1800);
    } catch {
      setPasswordFeedback({
        tone: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <>
      <Card className="flex flex-col p-6">
        <CardTitle eyebrow="Username">Change your username</CardTitle>
        <p className="mt-2 text-small text-slate">
          This is the name you sign in with. It must be unique.
        </p>

        <form
          onSubmit={submitUsername(onChangeUsername)}
          className="mt-6 flex flex-col gap-5"
        >
          <Field
            id="account-username"
            label="New username"
            error={usernameErrors.username?.message}
          >
            <input
              id="account-username"
              type="text"
              autoComplete="username"
              aria-invalid={Boolean(usernameErrors.username)}
              className={cn(
                "input",
                usernameErrors.username && "input-invalid"
              )}
              {...registerUsername("username")}
            />
          </Field>

          <div className="flex items-center justify-between gap-4 border-t border-mist pt-5">
            <div className="min-w-0">
              <FeedbackBanner feedback={usernameFeedback} />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetUsername({ username: CURRENT_ADMIN.username });
                  setUsernameFeedback(null);
                }}
              >
                Reset
              </Button>
              <Button type="submit" size="sm" disabled={isSavingUsername}>
                {isSavingUsername ? "Saving…" : "Save username"}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card className="flex flex-col p-6">
        <CardTitle eyebrow="Password">Change your password</CardTitle>
        <p className="mt-2 text-small text-slate">
          You will be signed out afterwards, because changing your password ends
          the current session.
        </p>

        <form
          onSubmit={submitPassword(onChangePassword)}
          className="mt-6 flex flex-col gap-5"
        >
          <Field id="account-old-password" label="Current password">
            <input
              id="account-old-password"
              type="password"
              autoComplete="current-password"
              className="input"
              {...registerPassword("oldPassword")}
            />
          </Field>

          <Field
            id="account-new-password"
            label="New password"
            error={passwordErrors.newPassword?.message}
          >
            <input
              id="account-new-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(passwordErrors.newPassword)}
              className={cn(
                "input",
                passwordErrors.newPassword && "input-invalid"
              )}
              {...registerPassword("newPassword")}
            />
          </Field>

          <Field
            id="account-confirm-password"
            label="Confirm new password"
            error={passwordErrors.confirmPassword?.message}
          >
            <input
              id="account-confirm-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(passwordErrors.confirmPassword)}
              className={cn(
                "input",
                passwordErrors.confirmPassword && "input-invalid"
              )}
              {...registerPassword("confirmPassword")}
            />
          </Field>

          <div className="flex items-center justify-between gap-4 border-t border-mist pt-5">
            <div className="min-w-0">
              <FeedbackBanner feedback={passwordFeedback} />
            </div>
            <Button type="submit" size="sm" disabled={isSavingPassword}>
              {isSavingPassword ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </Card>

      <p className="col-span-2 flex items-start gap-2 text-caption text-slate">
        <InfoIcon size={14} strokeWidth={1.75} className="mt-px shrink-0" />
        These two forms call the live account endpoints. Every other admin screen
        is currently rendered from sample data.
      </p>
    </>
  );
};

export default AccountForms;