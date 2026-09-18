import * as z from "zod";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  usernameSchema,
} from "./generalSchema";

export const adminRegisterSchema = z.object({
  firstName: nameSchema.nonoptional("First name is required."),
  lastName: nameSchema.nonoptional("Last name is required."),
  middleName: nameSchema.optional(),
  username: usernameSchema.nonoptional("Username is required."),
  email: emailSchema.nonoptional("E-mail is required"),
  password: passwordSchema.nonoptional("Password is required."),
  role: z.literal(["admin", "super-admin"], {
    error: "Role has to be one of the two options('admin' or 'super-admin')",
  }),
});

export const adminLoginSchema = z.object({
  username: z.string().nonoptional("Username is required."),
  password: z.string().nonoptional("Password is required."),
});

export type adminRegisterSchemaType = z.infer<typeof adminRegisterSchema>;
export type adminLoginSchemaType = z.infer<typeof adminLoginSchema>;
