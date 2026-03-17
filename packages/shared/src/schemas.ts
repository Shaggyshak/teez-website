import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required").max(100).optional(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export const assetTypes = [
  "multifamily",
  "industrial",
  "retail",
  "mixed-use",
  "office",
] as const;

export const assetTypeSchema = z.enum(assetTypes);
