import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import AccountForms from "./AccountForms";
import { CURRENT_ADMIN, ROLE_LABEL, formatAdminDate } from "@/shared/mock/admins";

const PROFILE_FIELDS = [
  { label: "First name", value: CURRENT_ADMIN.firstName },
  { label: "Last name", value: CURRENT_ADMIN.lastName },
  { label: "Middle name", value: CURRENT_ADMIN.middleName ?? "—" },
  { label: "Username", value: `@${CURRENT_ADMIN.username}` },
  { label: "Email", value: CURRENT_ADMIN.email },
];

const AdminAccountPage = () => (
  <div className="flex flex-col gap-10">
    <div>
      <span className="eyebrow">Account</span>
      <h1 className="mt-3">Your details</h1>
      <p className="mt-3 max-w-2xl">
        Your name and email are managed by a super-admin. You can update your own
        username and password from here.
      </p>
    </div>

    <Card className="max-w-3xl overflow-hidden">
      <div className="flex items-center gap-5 border-b border-mist bg-mist p-6">
        <span className="flex size-14 items-center justify-center rounded-full bg-ink font-mono text-h3 text-paper">
          {CURRENT_ADMIN.firstName[0]}
          {CURRENT_ADMIN.lastName[0]}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-h3 font-semibold">
            {CURRENT_ADMIN.firstName} {CURRENT_ADMIN.lastName}
          </span>
          <span className="text-small text-slate">@{CURRENT_ADMIN.username}</span>
        </div>
        <Badge
          tone={CURRENT_ADMIN.role === "super-admin" ? "transit" : "neutral"}
          className="ml-auto"
        >
          {ROLE_LABEL[CURRENT_ADMIN.role]}
        </Badge>
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-5 p-6">
        {PROFILE_FIELDS.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <dt className="font-mono text-caption tracking-[0.12em] uppercase text-slate">
              {field.label}
            </dt>
            <dd className="text-body text-ink">{field.value}</dd>
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <dt className="font-mono text-caption tracking-[0.12em] uppercase text-slate">
            Member since
          </dt>
          <dd className="text-body text-ink">
            {formatAdminDate(CURRENT_ADMIN.createdAt)}
          </dd>
        </div>
      </dl>
    </Card>

    <div className="grid max-w-5xl grid-cols-2 gap-6 items-start">
      <AccountForms />
    </div>
  </div>
);

export default AdminAccountPage;