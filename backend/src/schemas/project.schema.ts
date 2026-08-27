import { z } from "zod";

const projectImageInput = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  order: z.number().int().default(0),
});

export const createProjectSchema = z.object({
  order: z.number().int().default(0),
  titleTh: z.string().min(1, "Thai title is required"),
  titleEn: z.string().min(1, "English title is required"),
  descTh: z.string().min(1, "Thai description is required"),
  descEn: z.string().min(1, "English description is required"),
  tags: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  images: z.array(projectImageInput).default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
