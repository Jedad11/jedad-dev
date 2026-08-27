import { z } from "zod";

export const socialPlatformEnum = z.enum([
  "GITHUB",
  "LINKEDIN",
  "UPWORK",
  "FIVERR",
  "FREELANCER",
  "FACEBOOK",
  "INSTAGRAM",
  "FASTWORK",
  "X",
  "BEHANCE",
  "DISCORD",
  "WEBSITE",
  "EMAIL",
  "OTHER",
]);

export const createSocialLinkSchema = z.object({
  platform: socialPlatformEnum,
  url: z.string().min(1, "URL is required"),
  displayText: z.string().optional(),
  label: z.string().optional(),
  order: z.number().int().default(0),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();

export type CreateSocialLinkInput = z.infer<typeof createSocialLinkSchema>;
export type UpdateSocialLinkInput = z.infer<typeof updateSocialLinkSchema>;
