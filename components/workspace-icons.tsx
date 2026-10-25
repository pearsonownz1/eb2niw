import {
  ClipboardList,
  Files,
  FolderOpen,
  LayoutDashboard,
  MessagesSquare,
  PlayCircle,
  Scale,
  type LucideIcon,
} from "lucide-react";
import type { SectionId } from "@/lib/workspace-sections";

export const workspaceIcons: Record<SectionId, LucideIcon> = {
  overview: LayoutDashboard,
  templates: Files,
  tutorials: PlayCircle,
  documents: FolderOpen,
  forms: ClipboardList,
  community: MessagesSquare,
  attorney: Scale,
};
