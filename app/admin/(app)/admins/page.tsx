import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import AdminsManager from "./AdminsManager";
import { AVAILABLE_ADMIN_ROLES } from "@/shared/types/admin";

const ROLE_NOTES: Record<(typeof AVAILABLE_ADMIN_ROLES)[number], string> = {
  admin: "Can manage operators, routes and stops.",
  "super-admin": "Everything an admin can do, plus managing admin accounts.",
};

const AdminManageAdminsPage = () => (
  <div className="flex flex-col gap-10">
    <div>
      <span className="eyebrow">Access control</span>
      <h1 className="mt-3">Manage admins</h1>
      <p className="mt-3 max-w-2xl">
        Admin accounts are created here. Each account signs in with its own
        username and password, and every change is recorded against the account
        that made it.
      </p>
    </div>

    <div className="flex flex-wrap gap-4">
      {AVAILABLE_ADMIN_ROLES.map((role) => (
        <Card key={role} className="flex min-w-72 flex-1 flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <Badge tone={role === "super-admin" ? "transit" : "neutral"}>
              {role}
            </Badge>
          </div>
          <p className="text-small">{ROLE_NOTES[role]}</p>
        </Card>
      ))}
    </div>

    <div className="flex items-center gap-3 border border-dashed border-stone rounded-md bg-surface px-4 py-3">
      <Badge tone="neutral">Sample data</Badge>
      <p className="text-caption text-slate">
        Rows below are local sample records. The create and remove actions update
        this table only — nothing is written to the database yet.
      </p>
    </div>

    <div className="flex flex-col gap-6">
      <AdminsManager />
    </div>
  </div>
);

export default AdminManageAdminsPage;