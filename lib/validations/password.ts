import { z } from "zod"

// Reasonably strong without being punishing for a small internal team:
// meaningful length plus a mix of letters and numbers.
export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters")
  .max(200)
  .regex(/[a-zA-Z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number")
