import type { MessageSource } from "../../features/messages/messagePreview";
import type { IslandPage } from "./types";
import { PLUGINS_ENABLED } from "../../features/releaseFlags.ts";

/** Which modules are switched on; an off module is hidden on the island. */
export type IslandFeatures = {
  todo: boolean;
  music: boolean;
  clipboard: boolean;
  shelf: boolean;
  qq: boolean;
  wechat: boolean;
  qqMail: boolean;
  /** Windows notifications from the other applications; on whenever the listener is. */
  toast: boolean;
  plugin?: boolean;
  /** The AI Agent switch; off hides the Agent page. */
  agents: boolean;
  /** Translation is on and set to open as an island page rather than its own window. */
  translation: boolean;
  /** The CPU / memory / network panel. */
  system: boolean;
};

const PAGE_ORDER: IslandPage[] = [
  "todo",
  "music",
  "clipboard",
  "shelf",
  "qq",
  "agents",
  "translation",
  "system",
];
const SOURCE_ORDER: MessageSource[] = ["wechat", "qq", "qqMail", "toast", "plugin"];

export function isPageEnabled(page: IslandPage, features: IslandFeatures): boolean {
  if (page === "settings") return true;
  if (page === "system") return features.system;
  return page === "qq" ? features.qq || features.wechat || features.qqMail || features.toast || (PLUGINS_ENABLED && features.plugin === true) : features[page] === true;
}

/** `page` when it is on, otherwise the first page that is, or null when every page is off. */
export function resolveIslandPage(page: IslandPage, features: IslandFeatures): IslandPage | null {
  if (isPageEnabled(page, features)) return page;
  return PAGE_ORDER.find((candidate) => isPageEnabled(candidate, features)) ?? null;
}

/**
 * The page the island keeps open. A clipboard opened in its own window is no island page, so a
 * remembered clipboard page moves on: otherwise every click on the island would only open that
 * window again and the island could never reach another page.
 */
export function islandPageFor(page: IslandPage, features: IslandFeatures, clipboardDetached: boolean): IslandPage | null {
  return resolveIslandPage(page, clipboardDetached ? { ...features, clipboard: false } : features);
}

/** `source` when it is on, otherwise the first message source that is (or `source` if none). */
export function resolveMessageSource(source: MessageSource, features: IslandFeatures): MessageSource {
  const enabled = (candidate: MessageSource) => (PLUGINS_ENABLED || candidate !== "plugin") && features[candidate];
  if (enabled(source)) return source;
  return SOURCE_ORDER.find(enabled) ?? (source === "plugin" && !PLUGINS_ENABLED ? "qqMail" : source);
}
