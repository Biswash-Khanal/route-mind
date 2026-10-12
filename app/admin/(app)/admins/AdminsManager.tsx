"use client";

import { useMemo, useState } from "react";
import Card, { CardTitle } from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import { CheckIcon, SearchIcon, Trash2Icon, UserPlusIcon, XIcon } from "lucide-react";
import {
  CURRENT_ADMIN,
  MOCK_ADMINS,
  ROLE_LABEL,
  formatAdminDate,
} from "@/shared/mock/admins";
import { AdminDetails, AvailableAdminRoles } from "@/shared/types/admin";
import { cn } from "@/utilities/cn";

const ROLE_OPTIONS: AvailableAdminRoles[] = ["admin", "super-admin"];

const initialsOf = (admin: AdminDetails) =>
  `${admin.firstName[0]}${admin.lastName[0]}`;

/**
 * Admin directory.
 *
 * Backed by local state seeded from `shared/mock/admins` — the create, update
 * and delete calls are stubbed because the read endpoints that would feed this
 * table are not finished. Swapping in `GET/POST /api/admin/users` is the only
 * change needed; the filtering and row layout are already shaped around that
 * response.
 *
 * Rows are held in state rather than derived from props so that deleting the
 * in-progress row is a local operation, and so the current session is protected
 * from being removed by the UI.
 */
const AdminsManager = () => {
  const [admins, setAdmins] = useState<AdminDetails[]>(MOCK_ADMINS);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AvailableAdminRoles>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<string | null>(null);

  const visibleAdmins = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return admins.filter((admin) => {
      const matchesRole = roleFilter === "all" || admin.role === roleFilter;
      const matchesQuery =
        needle === "" ||
        `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(needle) ||
        admin.username.toLowerCase().includes(needle) ||
        admin.email.toLowerCase().includes(needle);

      return matchesRole && matchesQuery;
    });
  }, [admins, query, roleFilter]);

  function removeAdmin(id: string) {
    setAdmins((current) => current.filter((admin) => admin.id !== id));
    setPendingDeletion(null);
  }

  const deletingAdmin = admins.find((admin) => admin.id === pendingDeletion);

  return (
    <>
      <Card className="flex flex-col p-6">
        <div className="flex items-start justify-between gap-6">
          <CardTitle eyebrow="New account">
            {isCreating ? "Invite an administrator" : "Add someone to the team"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating((current) => !current)}
          >
            {isCreating ? (
              <>
                <XIcon size={15} strokeWidth={1.75} />
                Cancel
              </>
            ) : (
              <>
                <UserPlusIcon size={15} strokeWidth={1.75} />
                Add admin
              </>
            )}
          </Button>
        </div>

        {isCreating && (
          <CreateAdminForm
            onCreate={(admin) => {
              setAdmins((current) => [admin, ...current]);
              setIsCreating(false);
            }}
          />
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-6 border-b border-mist bg-mist px-6 py-4">
          <div className="relative w-72">
            <SearchIcon
              size={15}
              strokeWidth={1.75}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, username or email"
              aria-label="Search admins"
              className="input pl-9"
            />
          </div>

          <div
            role="radiogroup"
            aria-label="Filter by role"
            className="flex items-center gap-1 rounded-md border border-mist bg-surface p-1"
          >
            {(["all", ...ROLE_OPTIONS] as const).map((role) => {
              const isActive = roleFilter === role;

              return (
                <button
                  key={role}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "rounded-md px-3 py-1 font-mono text-caption tracking-[0.08em] uppercase transition-colors",
                    isActive ? "bg-ink text-paper" : "text-slate hover:text-ink"
                  )}
                >
                  {role === "all" ? "All" : ROLE_LABEL[role]}
                </button>
              );
            })}
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead className="border-b border-mist">
            <tr>
              <th className="table-head">Administrator</th>
              <th className="table-head">Username</th>
              <th className="table-head">Email</th>
              <th className="table-head">Role</th>
              <th className="table-head">Created</th>
              <th className="table-head">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {visibleAdmins.map((admin) => {
              const isCurrentUser = admin.id === CURRENT_ADMIN.id;

              return (
                <tr key={admin.id} className="transition-colors hover:bg-mist">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-ink font-mono text-caption text-paper">
                        {initialsOf(admin)}
                      </span>
                      <span className="flex flex-col">
                        <span className="font-medium">
                          {admin.firstName} {admin.lastName}
                        </span>
                        {isCurrentUser && (
                          <span className="font-mono text-caption tracking-[0.1em] uppercase text-transit-500">
                            You
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell font-mono text-caption">
                    @{admin.username}
                  </td>
                  <td className="table-cell text-slate">{admin.email}</td>
                  <td className="table-cell">
                    <Badge tone={admin.role === "super-admin" ? "transit" : "neutral"}>
                      {ROLE_LABEL[admin.role]}
                    </Badge>
                  </td>
                  <td className="table-cell text-caption text-slate">
                    {formatAdminDate(admin.createdAt)}
                  </td>
                  <td className="table-cell text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isCurrentUser}
                      title={
                        isCurrentUser
                          ? "You cannot remove your own account"
                          : `Remove ${admin.username}`
                      }
                      onClick={() => setPendingDeletion(admin.id)}
                      className="text-slate hover:text-danger"
                    >
                      <Trash2Icon size={15} strokeWidth={1.75} />
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}

            {visibleAdmins.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-small text-slate">
                  No administrators match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="border-t border-mist px-6 py-3">
          <span className="font-mono text-caption tracking-[0.1em] uppercase text-slate">
            {visibleAdmins.length} of {admins.length} shown
          </span>
        </div>
      </Card>

      {deletingAdmin && (
        <ConfirmDialog
          admin={deletingAdmin}
          onCancel={() => setPendingDeletion(null)}
          onConfirm={() => removeAdmin(deletingAdmin.id)}
        />
      )}
    </>
  );
};

interface CreateAdminFormProps {
  onCreate: (admin: AdminDetails) => void;
}

/** Local-only stand-in for `POST /api/admin/users`. */
const CreateAdminForm = ({ onCreate }: CreateAdminFormProps) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "admin" as AvailableAdminRoles,
  });

  const canSubmit =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.username.trim() !== "" &&
    form.email.includes("@");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    onCreate({
      id: crypto.randomUUID(),
      middleName: null,
      createdAt: "2026-04-01 09:00:00",
      updatedAt: "2026-04-01 09:00:00",
      ...form,
    });

    setForm({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      role: "admin",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 grid grid-cols-2 gap-5 border-t border-mist pt-6"
    >
      <Field id="new-first-name" label="First name">
        <input
          id="new-first-name"
          value={form.firstName}
          onChange={(event) =>
            setForm((current) => ({ ...current, firstName: event.target.value }))
          }
          className="input"
        />
      </Field>

      <Field id="new-last-name" label="Last name">
        <input
          id="new-last-name"
          value={form.lastName}
          onChange={(event) =>
            setForm((current) => ({ ...current, lastName: event.target.value }))
          }
          className="input"
        />
      </Field>

      <Field id="new-username" label="Username">
        <input
          id="new-username"
          value={form.username}
          onChange={(event) =>
            setForm((current) => ({ ...current, username: event.target.value }))
          }
          className="input"
        />
      </Field>

      <Field id="new-email" label="Email">
        <input
          id="new-email"
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="input"
        />
      </Field>

      <Field id="new-role" label="Role">
        <select
          id="new-role"
          value={form.role}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              role: event.target.value as AvailableAdminRoles,
            }))
          }
          className="select"
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABEL[role]}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex items-end justify-end">
        <Button type="submit" disabled={!canSubmit}>
          <CheckIcon size={15} strokeWidth={1.75} />
          Create account
        </Button>
      </div>
    </form>
  );
};

interface ConfirmDialogProps {
  admin: AdminDetails;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Inline confirmation. A dialog element would be overkill for one destructive row action. */
const ConfirmDialog = ({ admin, onCancel, onConfirm }: ConfirmDialogProps) => (
  <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/30 p-10">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-remove-title"
      className="card w-full max-w-md p-6"
    >
      <h2 id="confirm-remove-title" className="text-h3">
        Remove @{admin.username}?
      </h2>
      <p className="mt-2 text-small">
        This immediately revokes their access. It cannot be undone from this
        screen.
      </p>

      <div className="mt-6 flex justify-end gap-2 border-t border-mist pt-5">
        <Button variant="secondary" onClick={onCancel}>
          Keep account
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          <Trash2Icon size={15} strokeWidth={1.75} />
          Remove
        </Button>
      </div>
    </div>
  </div>
);

export default AdminsManager;