import {
  SiGithub,
  SiUpwork,
  SiFiverr,
  SiFreelancer,
  SiFacebook,
  SiInstagram,
  SiX,
  SiBehance,
  SiDiscord,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { Globe, Mail, Briefcase } from "lucide-react";
import type { SocialPlatform } from "../types";

const ICONS: Partial<Record<SocialPlatform, React.ComponentType<{ className?: string }>>> = {
  GITHUB: SiGithub,
  LINKEDIN: FaLinkedin,
  UPWORK: SiUpwork,
  FIVERR: SiFiverr,
  FREELANCER: SiFreelancer,
  FACEBOOK: SiFacebook,
  INSTAGRAM: SiInstagram,
  X: SiX,
  BEHANCE: SiBehance,
  DISCORD: SiDiscord,
  WEBSITE: Globe,
  EMAIL: Mail,
};

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const Icon = ICONS[platform] ?? Briefcase;
  return <Icon className={className} />;
}
