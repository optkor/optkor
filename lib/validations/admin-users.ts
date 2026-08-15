import { z } from "zod"
import { passwordSchema } from "./password"

export const createAdminSchema = z
  .object({
    full_name: z.string().trim().min(1, "Name is required").max(200),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(320),
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export const changeOwnPasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "New password must be different from your current password",
    path: ["new_password"],
  })
