export const accentIds = ["sky", "indigo", "teal", "violet", "orange", "rose", "emerald"] as const;

export type AccentId = (typeof accentIds)[number];

export type SectionId = "overview" | "templates" | "tutorials" | "documents" | "forms" | "community" | "attorney";

export type WorkspaceSection = {
  id: SectionId;
  href: string;
  label: string;
  exact: boolean;
  accent: AccentId;
  description: string;
};

export const workspaceSections: readonly WorkspaceSection[] = [
  {
    id: "overview",
    href: "/dashboard",
    label: "Overview",
    exact: true,
    accent: "sky",
    description: "Where the petition stands, and what to do next.",
  },
  {
    id: "templates",
    href: "/dashboard/templates",
    label: "Templates",
    exact: false,
    accent: "indigo",
    description: "Letter outlines, exhibit lists, and request notes.",
  },
  {
    id: "tutorials",
    href: "/dashboard/tutorials",
    label: "Tutorials",
    exact: false,
    accent: "teal",
    description: "Short videos for the letter, exhibits, and forms.",
  },
  {
    id: "documents",
    href: "/dashboard/documents",
    label: "Documents",
    exact: false,
    accent: "violet",
    description: "Exhibits you upload. They stay in your account.",
  },
  {
    id: "forms",
    href: "/dashboard/forms",
    label: "Forms",
    exact: false,
    accent: "orange",
    description: "Help filling the I-140 and the forms that go with it.",
  },
  {
    id: "community",
    href: "/dashboard/community",
    label: "Community",
    exact: false,
    accent: "rose",
    description: "A place to talk with other people preparing a petition.",
  },
  {
    id: "attorney",
    href: "/dashboard/attorney",
    label: "Attorney Review",
    exact: false,
    accent: "emerald",
    description: "An independent attorney on the Premium plan.",
  },
];

export const accentClass: Record<
  AccentId,
  { tile: string; icon: string; bar: string; chip: string }
> = {
  sky: {
    tile: "bg-sky-50",
    icon: "text-sky-700",
    bar: "bg-sky-600",
    chip: "bg-sky-50 text-sky-900",
  },
  indigo: {
    tile: "bg-indigo-50",
    icon: "text-indigo-700",
    bar: "bg-indigo-600",
    chip: "bg-indigo-50 text-indigo-900",
  },
  teal: {
    tile: "bg-teal-50",
    icon: "text-teal-800",
    bar: "bg-teal-600",
    chip: "bg-teal-50 text-teal-900",
  },
  violet: {
    tile: "bg-violet-50",
    icon: "text-violet-700",
    bar: "bg-violet-600",
    chip: "bg-violet-50 text-violet-900",
  },
  orange: {
    tile: "bg-orange-50",
    icon: "text-orange-800",
    bar: "bg-orange-600",
    chip: "bg-orange-50 text-orange-950",
  },
  rose: {
    tile: "bg-rose-50",
    icon: "text-rose-700",
    bar: "bg-rose-600",
    chip: "bg-rose-50 text-rose-900",
  },
  emerald: {
    tile: "bg-emerald-50",
    icon: "text-emerald-800",
    bar: "bg-emerald-600",
    chip: "bg-emerald-50 text-emerald-950",
  },
};

export function sectionById(id: SectionId): WorkspaceSection {
  const section = workspaceSections.find((item) => item.id === id);
  if (!section) {
    throw new Error(`Unknown workspace section ${id}`);
  }
  return section;
}

export function greetingName(fullName: string | null, email: string | null): string | null {
  const fromName = fullName?.trim().split(/\s+/)[0];
  if (fromName && /\p{L}/u.test(fromName)) {
    return fromName;
  }
  if (!email) {
    return null;
  }
  const word = (email.split("@")[0] ?? "").split(/[._+-]/)[0] ?? "";
  if (word.length < 2 || !/[a-z]/i.test(word)) {
    return null;
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
