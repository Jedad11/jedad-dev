export interface ProjectImage {
  id: string;
  url: string;
  publicId: string;
  order: number;
  projectId: string;
}

export interface Project {
  id: string;
  order: number;
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
  tags: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  createdAt: string;
  updatedAt: string;
  images: ProjectImage[];
}

export type SocialPlatform =
  | "GITHUB"
  | "LINKEDIN"
  | "UPWORK"
  | "FIVERR"
  | "FREELANCER"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "FASTWORK"
  | "X"
  | "BEHANCE"
  | "DISCORD"
  | "WEBSITE"
  | "EMAIL"
  | "OTHER";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  displayText: string | null;
  label: string | null;
  order: number;
}

export type Language = "th" | "en";
