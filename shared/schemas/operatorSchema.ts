import * as z from "zod";
import { nameSchema } from "./generalSchema";

export const operatorCreateSchema = z.object({
  name: nameSchema.nonoptional("Name is required."),
  address: z.string().min(3).max(100).optional(),
  contactEmail: z.email("Email must be in valid format.").optional(),
  contactPhone: z
    .e164("Phone number must be in valid format(+9XXYYYYYYYYYY),")
    .optional(),
  licenseNumber: z.string().min(3).max(100).optional(),
  websiteUrl: z.url("Website must be a valid URL.").optional(),
});

export const operatorUpdateSchema = operatorCreateSchema.partial();

export type OperatorCreateSchemaType = z.infer<typeof operatorCreateSchema>;
export type OperatorUpdateSchemaType = z.infer<typeof operatorUpdateSchema>;
