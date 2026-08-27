import type { SocialLink } from "../types";

export function getDisplayText(link: SocialLink): string {
  if (link.displayText) return link.displayText;
  return link.url.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export function getPlatformLabel(link: SocialLink): string {
  if (link.platform === "OTHER" && link.label) return link.label;
  return link.platform;
}
