import type { Language } from "../types";

export const strings = {
  th: {
    nav: { brand: "jedad", brandDot: ".dev" },
    hero: {
      prompt: "> Full-stack developer",
      lede: "นักศึกษา KMUTT ที่สนุกกับการออกแบบ API และระบบหลังบ้าน ตอนนี้เปิดรับงานฟรีแลนซ์อยู่",
    },
    projects: {
      label: "// โปรเจกต์",
      empty: "ยังไม่มีโปรเจกต์ในตอนนี้",
      error: "โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง",
      retry: "ลองอีกครั้ง",
    },
    detail: {
      back: "กลับหน้าแรก",
      liveUrl: "เว็บไซต์จริง",
      githubUrl: "ซอร์สโค้ด",
      notFound: "ไม่พบโปรเจกต์นี้",
    },
    contact: { label: "// ติดต่อ" },
    admin: {
      loginTitle: "เข้าสู่ระบบผู้ดูแล",
      username: "ชื่อผู้ใช้",
      password: "รหัสผ่าน",
      login: "เข้าสู่ระบบ",
      loggingIn: "กำลังเข้าสู่ระบบ…",
      invalidCreds: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      dashboard: "แดชบอร์ด",
      logout: "ออกจากระบบ",
      projectsPanel: "จัดการโปรเจกต์",
      socialPanel: "จัดการช่องทางติดต่อ",
      addProject: "เพิ่มโปรเจกต์",
      edit: "แก้ไข",
      delete: "ลบ",
      save: "บันทึก",
      saving: "กำลังบันทึก…",
      cancel: "ยกเลิก",
      add: "เพิ่ม",
    },
  },
  en: {
    nav: { brand: "jedad", brandDot: ".dev" },
    hero: {
      prompt: "> Full-stack developer",
      lede: "KMUTT student who enjoys designing APIs and backend systems. Currently available for freelance work.",
    },
    projects: {
      label: "// Projects",
      empty: "No projects yet",
      error: "Couldn't load projects — try again",
      retry: "Retry",
    },
    detail: {
      back: "Back home",
      liveUrl: "Live site",
      githubUrl: "Source code",
      notFound: "Project not found",
    },
    contact: { label: "// contact" },
    admin: {
      loginTitle: "Admin login",
      username: "Username",
      password: "Password",
      login: "Log in",
      loggingIn: "Logging in…",
      invalidCreds: "Invalid username or password",
      dashboard: "Dashboard",
      logout: "Log out",
      projectsPanel: "Manage projects",
      socialPanel: "Manage social links",
      addProject: "Add project",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      saving: "Saving…",
      cancel: "Cancel",
      add: "Add",
    },
  },
} satisfies Record<Language, unknown>;

export type Strings = typeof strings.th;
