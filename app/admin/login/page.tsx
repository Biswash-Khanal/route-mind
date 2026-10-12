import Link from "next/link";
import { sanitizeCallbackUrl } from "@/utilities/callbackUrl";
import AdminLoginForm from "./LoginForm";
import { ArrowLeftIcon, ShieldCheckIcon } from "lucide-react";

/**
 * Sign-in page. Sits outside the admin route group so it renders without the
 * authenticated shell, and `proxy.ts` reverse-gates it — an existing session
 * is bounced to `callbackUrl` before this component ever renders.
 */
const AdminLoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-10 py-20">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-md bg-ink">
            <span className="size-3 rounded-full bg-transit-400" />
          </span>
          <span className="eyebrow">Admin area</span>
          <h1 className="text-center">Sign in to RouteMind</h1>
          <p className="flex items-center gap-2 text-center text-small text-slate">
            <ShieldCheckIcon size={14} strokeWidth={1.75} className="shrink-0" />
            Restricted to RouteMind administrators.
          </p>
        </div>

        <div className="card mt-8 p-6">
          <AdminLoginForm callbackUrl={safeCallbackUrl} />
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-caption text-slate transition-colors hover:text-ink"
          >
            <ArrowLeftIcon size={13} strokeWidth={1.75} />
            Back to the public site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;