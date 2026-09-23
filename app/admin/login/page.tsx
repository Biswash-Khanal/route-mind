import { sanitizeCallbackUrl } from "@/utilities/callbackUrl";
import AdminLoginForm from "./LoginForm";

const AdminLoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
      <AdminLoginForm callbackUrl={sanitizeCallbackUrl(callbackUrl)} />
    </div>
  );
};

export default AdminLoginPage;