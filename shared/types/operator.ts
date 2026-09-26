// 1. Master Routes Entity (Complete DB Representation)
export interface MasterOperator {
  id: string;
  name: string;
  contactEmail: string | null;
  address: string | null;
  contactPhone: string | null;
  licenseNumber: string | null;
  websiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// 2. Safe Public DTO
export type OperatorDetails = MasterOperator;
