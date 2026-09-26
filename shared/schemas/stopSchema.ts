import * as z from "zod";
import { nameSchema } from "./generalSchema";

export const stopCreateSchema = z.object({
  name: nameSchema.nonoptional("Name is required."),
  // Stored in REAL columns. The bounds are enforced here because SQLite type
  // affinity would otherwise accept any number and let an impossible coordinate
  // reach the map.
  latitude: z
    .number("Latitude must be a number.")
    .finite("Latitude must be a finite number.")
    .min(-90, "Latitude cannot be below -90.")
    .max(90, "Latitude cannot be above 90.")
    .nonoptional("Latitude is required."),
  longitude: z
    .number("Longitude must be a number.")
    .finite("Longitude must be a finite number.")
    .min(-180, "Longitude cannot be below -180.")
    .max(180, "Longitude cannot be above 180.")
    .nonoptional("Longitude is required."),
});

// Every field optional, so PATCH may change one column at a time.
export const stopUpdateSchema = stopCreateSchema.partial();

export type StopCreateSchemaType = z.infer<typeof stopCreateSchema>;
export type StopUpdateSchemaType = z.infer<typeof stopUpdateSchema>;
