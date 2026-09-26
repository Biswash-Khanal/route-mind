//this allows me to use this more common type at places where the avalibale roles selection is there
export const AVAILABLE_ADMIN_ROLES = ["admin", "super-admin"] as const;

export type AdminRoles = typeof AVAILABLE_ADMIN_ROLES;

export type AvailableAdminRoles = AdminRoles[number];

// 1. Master Admin Entity (Complete DB Representation)
export interface MasterAdmin {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  role: AvailableAdminRoles;
  createdAt: string;
  updatedAt: string;
}

// 2. Safe Public DTO (Used for POST /login and GET /me responses)
// Omit sensitive data like passwordHash
export type AdminDetails = Omit<MasterAdmin, "passwordHash">;

// 3. Lean JWT Claims Payload
// Pick ONLY what the backend wrapper needs for instant verification
export type JwtAdminPayload = Pick<MasterAdmin, "id" | "role" | "email">;

