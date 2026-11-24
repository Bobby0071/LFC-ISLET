/** Text for the island system panel (CPU / memory / network). */
export type SystemText = {
  title: string;
  cpu: string;
  memory: string;
  network: string;
  download: string;
  upload: string;
  /** Shown until the second sample arrives; rates need two readings. */
  sampling: string;
  unavailable: string;
  refreshFailed: string;
};

export const zhCN: SystemText = {
  title: "系统",
  cpu: "CPU",
  memory: "内存",
  network: "网络",
  download: "下载",
  upload: "上传",
  sampling: "采集中…",
  unavailable: "不可用",
  refreshFailed: "读取失败，正在重试",
};

export const en: SystemText = {
  title: "System",
  cpu: "CPU",
  memory: "Memory",
  network: "Network",
  download: "Down",
  upload: "Up",
  sampling: "Sampling…",
  unavailable: "Unavailable",
  refreshFailed: "Reading failed, retrying",
};
