import { SystemPanel } from "../../features/system/SystemPanel";
import { useSystemStats } from "../../features/system/useSystemStats";

/** Runs the sampler only while the panel is on screen. */
export function SystemPanelShell() {
  const { stats, failed } = useSystemStats(true);
  return <SystemPanel stats={stats} failed={failed} />;
}
