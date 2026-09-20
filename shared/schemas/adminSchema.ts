import * as z from "zod";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  usernameSchema,
} from "./generalSchema";
import { AVAILABLE_ADMIN_ROLES } from "../types/admin";

export const adminRegisterSchema = z.object({
  firstName: nameSchema.nonoptional("First name is required."),
  lastName: nameSchema.nonoptional("Last name is required."),
  middleName: nameSchema.optional(),
  username: usernameSchema.nonoptional("Username is required."),
  email: emailSchema.nonoptional("E-mail is required"),
  password: passwordSchema.nonoptional("Password is required."),
  role: z.enum(AVAILABLE_ADMIN_ROLES),
});

export const adminLoginSchema = z.object({
  username: z.string().nonoptional("Username is required."),
  password: z.string().nonoptional("Password is required."),
});

export const adminChangeUsernameSchema = z.object({
  username: usernameSchema.nonoptional("Username is required"),
});

export const adminChangePasswordSchema = z
  .object({
    oldPassword: z.string().nonoptional("Old Password is required."),
    newPassword: passwordSchema.nonoptional("New Password is required."),
    confirmPassword: passwordSchema.nonoptional(
      "New Password Confirmation is required.",
    ),
  })
  .refine((fields) => fields.oldPassword !== fields.newPassword, {
    error: "The new password must be different from the older one",
    path: ["newPassword"],
  })
  .refine((fields) => fields.newPassword === fields.confirmPassword, {
    error: "Please make sure this matches with the new password.",
    path: ["confirmPassword"],
  });

export const adminForcePasswordChangeSchema = z.object({
  id: z.uuid("ID needs to be a valid UUID").nonoptional("ID is required"),
  newPassword: passwordSchema.nonoptional("New Password is required."),
});

export type adminRegisterSchemaType = z.infer<typeof adminRegisterSchema>;
export type adminLoginSchemaType = z.infer<typeof adminLoginSchema>;
