// shared/mock/operators.ts
import { OperatorDetails } from "@/shared/types/operator";

/** Sample operators. Typed against the real DTO so live data is a drop-in swap. */
export const MOCK_OPERATORS: OperatorDetails[] = [
  {
    id: "b2d3e501-2222-4a02-8c02-000000000001",
    name: "Kathmandu Valley Bus",
    contactEmail: "ops@kathmandubus.example",
    address: "Ratna Park, Kathmandu",
    contactPhone: "+977-1-4410000",
    licenseNumber: "NP-TR-00412",
    websiteUrl: "https://kathmandubus.example",
    createdAt: "2025-11-02 08:30:00",
    updatedAt: "2026-02-18 11:05:00",
  },
  {
    id: "b2d3e501-2222-4a02-8c02-000000000002",
    name: "Sajha Yatayat",
    contactEmail: "contact@sajhayatayat.example",
    address: "Swoyambhu, Kathmandu",
    contactPhone: "+977-1-4331200",
    licenseNumber: "NP-TR-00518",
    websiteUrl: "https://sajhayatayat.example",
    createdAt: "2025-11-02 08:35:00",
    updatedAt: "2026-01-27 15:40:00",
  },
  {
    id: "b2d3e501-2222-4a02-8c02-000000000003",
    name: "Nepal Yatayat",
    contactEmail: "help@nepalyatayat.example",
    address: "Thamel Chowk, Kathmandu",
    contactPhone: "+977-1-4422780",
    licenseNumber: "NP-TR-00603",
    websiteUrl: "https://nepalyatayat.example",
    createdAt: "2025-12-11 10:02:00",
    updatedAt: "2025-12-11 10:02:00",
  },
  {
    id: "b2d3e501-2222-4a02-8c02-000000000004",
    name: "Lalitpur Yatayat",
    contactEmail: "info@lalitpuryatayat.example",
    address: "Lalitpur Durbar Square, Lalitpur",
    contactPhone: "+977-1-5201100",
    licenseNumber: "NP-TR-00677",
    websiteUrl: null,
    createdAt: "2026-01-09 13:22:00",
    updatedAt: "2026-03-02 09:15:00",
  },
];