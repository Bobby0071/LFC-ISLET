<div align="center">
  <img src="src-tauri/icons/mark.svg" alt="LFC-ISLET logo" width="96" height="96">

  <h1>LFC-ISLET</h1>

  <p>Windows 超轻量的灵动岛：微信、QQ、邮箱消息、AI Agent 多会话、额度环、音乐与同步歌词、待办、剪贴板、文件中转。需要时展开，用完收起。</p>

  <p>
    <img alt="Platform" src="https://img.shields.io/badge/platform-Windows-0078D4">
    <img alt="Tauri" src="https://img.shields.io/badge/Tauri-2-24C8DB">
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB">
    <img alt="License" src="https://img.shields.io/badge/license-GPL--3.0-blue">
  </p>

  <p><a href="README.en.md">English</a> · 中文</p>
</div>

> **本项目是 [fly-island](https://github.com/flyl1u/fly-island) 的 GPL-3.0 衍生分支**，原项目作者为 [@flyl1u](https://github.com/flyl1u)。LFC-ISLET 自 2026-11-16 起基于上游 v3.2.5 修改界面与命名，并以 GPL-3.0 继续开源。原作者不对本分支的行为负责，问题请提到本仓库而不是上游。

## 这是什么

LFC-ISLET 是一款 Windows 优先的灵动岛：微信、QQ 和邮箱消息直接弹到岛上，Claude Code / Codex / DSH / Workbuddy 等主流 Agent 跑到哪、要不要你审批一眼就知道，再加上同步歌词、文件中转、剪贴板历史、快捷翻译和待办，都收在屏幕顶部的一座小岛里。

它以轻量、无边框、始终置顶的悬浮岛形式运行，会在需要时展开，用完后回到紧凑状态，减少为了获取一条信息而切换窗口的次数。

## 为什么做它

日常工作或学习过程中，经常需要在某软件写下 Todo List；为了隔绝噪音会打开音乐软件把音量调到合适的临界点；工作和学习又经常需要借助翻译；同时还会反复复制粘贴代码；与此同时难以避免地接收不同群聊、好友的消息。

在这些界面之间来回切换，不仅降低效率，也容易让人分心。iPhone 的灵动岛把消息通知、计时器、媒体控制集中到一个小岛上，缩短了获取信息的路程——这个项目就是把同样的思路搬到 Windows。

## 功能

核心要解决的是工作和学习过程中频繁的窗口切换，把分散在不同窗口中的高频操作放进一个可折叠、可展开的悬浮岛：

- **微信、QQ 与邮箱**：微信和 QQ 的新消息直接弹到岛上，一条一张卡片，显示来源、联系人、时间和内容；微信免打扰的会话只在有人 @你 时提示。支持多个 IMAP 邮箱（QQ、163、126 等），邮件可以在岛上直接阅读。
- **AI Agent**：Claude Code / Claude 桌面端、Codex 和 DeepSeek Harness（DSH）的会话实时显示在岛上；Agent 要运行命令、改文件时，直接在岛上允许或拒绝，任务做完、等你回答时会轻声提示，点击会话跳到对应窗口。显示 Claude/Codex 额度环及 DSH 余额环。详见 [AI Agent 状态灯说明](docs/agent-status-hooks.md) 和 [DSH 接入说明与限制](docs/deepseek-harness.md)。
- **音乐与歌词**：通过 Windows 媒体会话控制播放，显示封面、波形、进度条和同步歌词；收起的岛上也能显示当前一句歌词。可以调整多个播放器的优先顺序，不常用的播放器可以归档。网易云精准进度可在岛上的提示卡片或「设置 → 音乐 → 播放器兼容性」一键安装 InfLink-rs 与 BetterNCM。
- **文件中转**：把文件拖到岛上暂存，换到别的窗口后再拖出去、复制或打开；只记录路径，不复制文件。详见 [文件中转说明](docs/file-shelf.md)。
- **图文剪贴板历史**：记录复制过的文本和图片，搜索内容或备注、收藏常用项，并一键复制回剪贴板。
- **快捷翻译**：用全局快捷键打开翻译，支持 DeepSeek、火山方舟、通义千问、Kimi、硅基流动、OpenAI 和自定义的 OpenAI 兼容接口，自动判断中英方向或手动指定。
- **待办、笔记与日历**：管理当天任务、设置当前任务、拖动排序；待办可以安排到以后的某一天，日历标出有待办的日子，可自动结转未完成任务并把任务和笔记保存为 Markdown。
- **外观与行为**：经典或液态玻璃外观、默认或像素字体，调整大小、透明度、颜色和位置，整套外观可存为预设；支持锁定位置、闲置贴边隐藏、游戏模式、开机自启动，界面可切换中文或英文。

待办、剪贴板和应用设置保存在本机。微信的会话名与最新消息摘要（实验性）、QQ 通知只保留在本次运行的内存中。邮箱后台仅同步邮件头，正文按需读取且只保留在内存，不会改变邮件已读状态。

### 与上游的差异

**新增功能**（上游没有）：

- **系统页**：直接读取本机 CPU、内存与网络速率，不需要额外的监控软件。
- **所有应用的 Windows 通知**：不只有 QQ，DSH、WorkBuddy 等任何应用的通知都会收进「通知」页签。其他应用的通知只累加角标，不会让岛自己弹出来打断你。
- **系统音量**：音乐页直接调节 Windows 输出音量，与播放进度分开——没在放歌也能调，任何播放器都通用。

**改造**：

- 游戏模式多了一个手动开关：打开后不论是否全屏，悬停都不展开，点一下才开。窗口化游戏也适用。
- 默认配色改为浅色方案（白底、深色文字），岛内灰块与强调色走统一的 tone 通道，深色模式下自动跟随。
- 关于页只保留 GPL-3.0 要求的归属声明，移除了上游的社群、Star 引导与打赏入口。

**其他**：

- 品牌与可执行文件名改为 **LFC-ISLET**，窗口标题、安装器发布者、应用标识（`com.lfcislet.island`）同步更新，旧数据会自动迁移。
- **关闭了应用内自动更新**：清空了更新端点，避免本分支被上游的发布覆盖。需要更新时请手动拉取本仓库源码重新构建。

## 使用说明

展开岛屿后，用顶部的页面按钮切换待办、音乐、剪贴板、文件中转、翻译、消息和 AI Agent 页面。收起的小岛上，点 Agent 指示灯或会话数字进入 AI Agent 页，点播放器波形进入音乐页，点文件数字进入文件中转，点中间的文字则回到上一次离开的页面。设置默认作为岛屿的一页打开，带分类侧栏；需要时可在「设置 → 通用 → 独立设置窗口」改为单独窗口。

### 功能设置

- **QQ 和微信提醒**：首次默认开启。QQ 需要 Windows 通知访问权限，且 QQ 已登录并启用系统通知；微信需要电脑版保持登录并发出任务栏提醒。
- **AI 状态灯**：在「设置 → 接入 AI 工具」安装或修复 Codex / Claude Code 钩子，然后重启 Codex 或运行 Claude Code 的终端。
- **邮箱**：在邮箱网页设置中开启 IMAP 并生成授权码，然后在「设置 → 邮箱」填写邮箱地址和授权码（不是登录密码）。凭据保存在 Windows 凭据管理器。
- **快捷翻译**：默认按 `Ctrl+Shift+F` 打开。首次使用时在「设置 → 翻译」选择服务并填写 API 密钥，密钥保存在 Windows 凭据管理器；提交翻译时原文会发送到所选服务。
- **剪贴板与文件中转**：在「设置 → 剪贴板与文件」调整是否记录、图片捕获、历史数量和唤出快捷键。

### 技术栈

- Tauri 2：Windows 桌面应用外壳和原生能力
- React 19 + TypeScript：前端界面和交互
- Rust：窗口、快捷键、剪贴板、媒体和文件等桌面能力
- pnpm：依赖安装与项目脚本

## 开发与构建

需要 Windows 10/11，以及：

- **Node.js 22 或更高**、**pnpm 10 或更高**
- **Rust**：版本由仓库里的 `rust-toolchain.toml` 固定（当前 1.99.1），装上 rustup 后会自动使用对应版本，无需手动指定
- **Visual Studio C++ Build Tools**（MSVC 工具链，Tauri 编译 Rust 需要）
- **WebView2 Runtime**（Windows 11 已内置；Windows 10 若缺失需手动安装）

```powershell
# 把下面的地址换成你要克隆的仓库地址
git clone https://github.com/<你的用户名>/LFC-ISLET.git
cd LFC-ISLET
pnpm install
pnpm tauri dev
```

运行统一检查：

```powershell
pnpm check
```

### 构建 Release

```powershell
pnpm tauri build
```

构建完成后，安装包位于：

- `src-tauri/target/release/bundle/nsis/LFC-ISLET_版本号_x64-setup.exe`
- `src-tauri/target/release/bundle/msi/LFC-ISLET_版本号_x64_en-US.msi`

应用内更新流程（签名与 `latest.json` 发布）在上游 [docs/updater.md](docs/updater.md) 中描述；本分支默认关闭该通道，如需启用要自行生成密钥并填写 `plugins.updater.pubkey` 与 `endpoints`。

## 贡献与致谢

- 原始项目：[fly-island](https://github.com/flyl1u/fly-island)，作者 [@flyl1u](https://github.com/flyl1u)。本分支的功能主体来自上游。
- 上游感谢 [@TixXin](https://github.com/TixXin) 在 [PR #36](https://github.com/flyl1u/fly-island/pull/36) 中提出的模块化架构方案与实现，来源与验证记录见 [改造说明](docs/architecture/refactor-plan.md)。

## 开源协议

本项目沿用上游的 [GNU 通用公共许可证第 3 版（GPL-3.0）](LICENSE)。你可以自由使用、修改和再分发；分发修改后的版本时，需要同样以 GPL-3.0 开源并提供源代码。

Copyright (C) 2026 flyl1u and contributors（上游）。LFC-ISLET 的修改部分同样以 GPL-3.0 发布。

第三方依赖和内置资源仍遵循各自的许可证。内置字体的许可信息见 [字体说明](src/assets/fonts/README.md)。随安装包附带的网易云进度插件 BetterNCM 与 InfLink-rs 采用 GPL-3.0，原样附带，许可证与源码链接见 [插件说明](src-tauri/resources/media-plugins/README.md)。

### 插件开发

> **注意**：本分支**不内置插件索引**，所以设置里的插件列表默认是空的，也不会去上游拉取索引。要安装插件需在「设置 → 插件 → 开发者」里填写自己构建的索引路径，或用环境变量 `FOCUSD_PLUGINS_INDEX` 指定。插件系统本身是完整的，只是没有官方市场。

从示例开始、本地调试，详见 [插件开发指引](docs/plugins/quickstart.md)。
