# 插件宿主

API v1 已实现为独立进程平台，协议见 [API](../plugins/api.md)。没有动态库、脚本解释器或 Webview 插件。

`plugin_host/manifest.rs` 校验清单；`protocol.rs` 校验快照；`packages.rs` 下载 / 哈希 / 受限 zip；`storage.rs` 安装状态与凭据；`process.rs` stdio 握手、请求超时和有限重启；`service.rs` 管理进程、安装事务与快照；`mod.rs` 只组装 Tauri 命令。已安装插件由各自进程执行，主程序不依赖插件 crate。

`win32/process_job.rs` 以 kill-on-close Job Object 管理插件及其子进程；正常停止先发可选 `shutdown`，最多等待 3 秒，再结束进程树。旧 v1 插件不实现 shutdown 仍可被停止。SDK 的输入和输出均限制为 256 KiB；会话按更新时间保留最多 200 条，缺失时间使用文件修改时间，不把历史文件刷新为刚完成。

前端 `features/plugins/` 提供类型化 IPC、共享快照与 manifest 设置行。额度和会话适配在 `features/agent-status/PluginQuotaRings.tsx`、`pluginSessions.ts`；消息在 `features/messages/PluginMessagesPanel.tsx` 和 `pluginNotifications.ts`。原有渲染组件继续负责视觉、列表和预览仲裁。

**本分支不内置插件索引**（`DEFAULT_INDEX` 为空字符串），因此默认不列出任何可安装插件，也不会去上游仓库拉取索引——那份索引里的包地址全部指向上游的 Release，与本分支无关。取值顺序：环境变量 `FOCUSD_PLUGINS_INDEX` 优先，其次是开发者模式下显式填写的路径，最后为空（空目录，不是错误）。自行发布时用 `scripts/release/build-plugins.ps1` 生成索引并填进去。插件的可执行文件和 API schema 都经维护者 review；权限是声明，没有把普通进程称为沙箱。
