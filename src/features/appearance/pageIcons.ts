import { Clipboard, Cpu, FolderInput, Languages, ListChecks, Music2, type LucideIcon } from "lucide-react";
import type { PageDot } from "./types";

export const PAGE_ICONS: Record<PageDot, LucideIcon> = {
  todo: ListChecks,
  music: Music2,
  clipboard: Clipboard,
  shelf: FolderInput,
  translation: Languages,
  // A processor, not an activity trace: this page reads CPU, memory and network.
  system: Cpu,
};
