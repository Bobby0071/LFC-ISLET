import { invoke } from "@tauri-apps/api/core";

// 与 src-tauri/src/system/monitor.rs 中的 SystemStats 对应。
export type SystemStats = {
  /** 整机 CPU 占用 0-100；首次采样只有基线，故可能为 null。 */
  cpu: number | null;
  /** 物理内存占用 0-100。 */
  memory: number;
  memoryUsedBytes: number;
  memoryTotalBytes: number;
  /** 相对上一次采样的字节/秒；首次采样为 null。 */
  networkRx: number | null;
  networkTx: number | null;
};

export function getSystemStats(): Promise<SystemStats> {
  return invoke<SystemStats>("get_system_stats");
}
