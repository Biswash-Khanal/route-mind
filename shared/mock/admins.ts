// shared/mock/admins.ts
import { AdminDetails, AvailableAdminRoles } from "@/shared/types/admin";

/**
 * Sample admin accounts for the management table. Password hashes are never
 * present here because `AdminDetails` is already the hash-free DTO.
 */
export const MOCK_ADMINS: AdminDetails[] = [
  {
    id: "c3a4b602-4444-4a04-8b04-000000000001",
    username: "root",
    email: "root@routemind.example",
    firstName: "Sabina",
    lastName: "Karki",
    middleName: null,
    role: "super-admin",
    createdAt: "2025-10-01 06:00:00",
    updatedAt: "2026-02-01 10:20:00",
  },
  {
    id: "c3a4b602-4444-4a04-8b04-000000000002",
    username: "aarav",
    email: "aarav@routemind.example",
    firstName: "Aarav",
    lastName: "Shrestha",
    middleName: "Raj",
    role: "admin",
    createdAt: "2025-11-14 09:12:00",
    updatedAt: "2026-01-22 14:05:00",
  },
  {
    id: "c3a4b602-4444-4a04-8b04-000000000003",
    username: "nisha",
    email: "nisha@routemind.example",
    firstName: "Nisha",
    lastName: "Basnet",
    middleName: null,
    role: "admin",
    createdAt: "2025-12-03 11:40:00",
    updatedAt: "2026-02-19 08:55:00",
  },
  {
    id: "c3a4b602-4444-4a04-8b04-000000000004",
    username: "bipul",
    email: "bipul@routemind.example",
    firstName: "Bipul",
    lastName: "Tamang",
    middleName: "Kumar",
    role: "admin",
    createdAt: "2026-01-08 13:26:00",
    updatedAt: "2026-01-08 13:26:00",
  },
  {
    id: "c3a4b602-4444-4a04-8b04-000000000005",
    username: "sunita",
    email: "sunita@routemind.example",
    firstName: "Sunita",
    lastName: "Gurung",
    middleName: null,
    role: "admin",
    createdAt: "2026-02-11 07:48:00",
    updatedAt: "2026-03-04 16:30:00",
  },
  {
    id: "c3a4b602-4444-4a04-8b04-000000000006",
    username: "prashant",
    email: "prashant@routemind.example",
    firstName: "Prashant",
    lastName: "Adhikari",
    middleName: null,
    role: "admin",
    createdAt: "2026-03-15 10:02:00",
    updatedAt: "2026-03-15 10:02:00",
  },
];

/**
 * The account the admin shell renders in its top bar. The real implementation
 * will read this from `GET /api/admin/me` instead of a constant.
 */
export const CURRENT_ADMIN: AdminDetails = MOCK_ADMINS[0];

export const ROLE_LABEL: Record<AvailableAdminRoles, string> = {
  "super-admin": "Super admin",
  admin: "Admin",
};

/** Formats a Turso `CURRENT_TIMESTAMP` string for display without a Date round-trip. */
export const formatAdminDate = (tursoDate: string): string =>
  new Date(tursoDate.replace(" ", "T") + "Z").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });