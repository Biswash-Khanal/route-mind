import * as z from "zod";
import { nameSchema } from "./generalSchema";

export const routeCreateSchema = z.object({
  name: nameSchema.nonoptional("Name is required."),
  // References `operators.id`. Existence is verified in the service so the caller
  // gets a clear ApiError instead of a raw foreign-key violation.
  operatorId: z.uuid("Operator id must be a valid uuid."),
  // Stored in a REAL column, so decimals are allowed and not coerced to integers.
  fare: z
    .number("Fare must be a number.")
    .finite("Fare must be a finite number.")
    .nonnegative("Fare must be non negative.")
    .nonoptional("Fare is required."),
});

// Every field optional, so PATCH may change one column at a time.
export const routeUpdateSchema = routeCreateSchema.partial();

export type RouteCreateSchemaType = z.infer<typeof routeCreateSchema>;
export type RouteUpdateSchemaType = z.infer<typeof routeUpdateSchema>;
