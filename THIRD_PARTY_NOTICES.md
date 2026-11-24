# 第三方组件声明 / Third-party notices

LFC-ISLET 以 **GNU 通用公共许可证第 3 版（GPL-3.0）** 发布，许可证全文见同目录的 `LICENSE`。
本文件列出随本程序一起分发的第三方组件及其许可证。

LFC-ISLET is released under the **GNU General Public License v3.0**; the full text is in `LICENSE`.
This file lists the third-party components distributed with it.

## 前端运行时 / Frontend runtime

| 组件 | 许可证 | 版权 |
|---|---|---|
| React、React DOM 19 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates |
| lucide-react | ISC | Copyright (c) Lucide Contributors |
| dompurify | MPL-2.0 OR Apache-2.0 | Copyright (c) Cure53 and Dr.-Ing. Mario Heiderich |
| @tauri-apps/api | Apache-2.0 OR MIT | Copyright (c) Tauri Programme within the Commons Conservancy |

MIT、ISC、Apache-2.0 与 MPL-2.0 均允许与 GPL-3.0 作品一同分发。对应许可证全文可在各组件仓库获取。

## Rust 依赖 / Rust dependencies

Rust 侧依赖均为宽松许可证（MIT / Apache-2.0 / BSD 系 / MPL-2.0），与 GPL-3.0 兼容。
完整清单：在 `src-tauri/` 下运行 `cargo metadata --format-version 1` 或 `cargo deny check licenses`。

## 内置字体 / Bundled fonts

**Fusion Pixel Font** — SIL Open Font License 1.1。
来源与许可见 `src/assets/fonts/README.md` 与 `src/assets/fonts/OFL-Fusion-Pixel.txt`。

## 内置媒体插件二进制 / Bundled media-plugin binaries

以下二进制原样附带，与本项目"聚合"而非派生（mere aggregation）：

| 组件 | 许可证 | 上游 |
|---|---|---|
| BetterNCM（BetterNCMII.dll、BetterNCMII86.dll） | GPL-3.0 | chromatic（BetterNCM 上游 tag 1.3.4） |
| InfLink-rs（InfLink-rs.plugin） | GPL-3.0 | InfLink-rs 上游仓库 |

随包附带 `media-plugins/LICENSE-GPL-3.0.txt` 与 `media-plugins/README.md`，其中记录了版本、上游地址与**对应源码的获取位置**。

## 源代码提供 / Source offer

本项目遵循 GPL-3.0。分发本程序的目标码时，对应源码可从发布仓库获取（仓库地址见 README），
或按同一地址提出索取请求。安装目录中的 `LICENSE` 为许可证全文。

This program is distributed under GPL-3.0. Corresponding source is available from the
project repository named in README, or on request at the same location.
