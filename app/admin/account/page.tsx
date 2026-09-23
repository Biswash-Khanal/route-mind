import Link from "next/link";

const AdminAccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Account Details</h1>
      <Link href="/admin" className="text-sm underline">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default AdminAccountPage;