<div align="center">
  <img src="src-tauri/icons/mark.svg" alt="LFC-ISLET logo" width="96" height="96">

  <h1>LFC-ISLET</h1>

  <p>An ultra-lightweight Dynamic Island for Windows: WeChat, QQ and email messages, multi-session AI agents, quota rings, music with synced lyrics, to-dos, clipboard and file shelf. Expand when needed, collapse when done.</p>

  <p>
    <img alt="Platform" src="https://img.shields.io/badge/platform-Windows-0078D4">
    <img alt="Tauri" src="https://img.shields.io/badge/Tauri-2-24C8DB">
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB">
    <img alt="License" src="https://img.shields.io/badge/license-GPL--3.0-blue">
  </p>

  <p>English · <a href="README.md">中文</a></p>
</div>

> **This is a GPL-3.0 fork of [fly-island](https://github.com/flyl1u/fly-island)** by [@flyl1u](https://github.com/flyl1u). LFC-ISLET has been modified from upstream v3.2.5 since 2026-11-16, changing the branding and appearance on top of that codebase and staying open source under the same license. The upstream author is not responsible for this fork; please report issues here rather than upstream.

## What is this?

LFC-ISLET is a Windows-first Dynamic Island for your desktop. WeChat, QQ and mail messages pop up right on the island, and you can see at a glance what Claude Code / Codex / DSH / Workbuddy is doing and whether it needs your approval. Synced lyrics, a file shelf, clipboard history, quick translation and tasks join them in one small island at the top of the screen.

It runs as a lightweight, borderless, always-on-top floating island. Expand it when you need information, then return to the compact state and keep working.

## Why I built this

During everyday work and study I often keep a todo list in some app, open music to block out noise, use translation websites, and copy or paste code again and again — while messages from group chats and friends keep arriving.

Switching between all those windows reduces efficiency and makes it easier to lose focus. The iPhone's Dynamic Island gathers notifications, timers and media controls into one small area and shortens the distance to that information; this project brings the same idea to Windows.

## Features

The core problem is constant window switching, so the frequent actions are collected into one collapsible, expandable island:

- **WeChat, QQ and mail**: new WeChat and QQ messages pop onto the island as one card each, with source, contact, time and content. Muted WeChat conversations only notify you when someone @mentions you. Multiple IMAP accounts (QQ, 163, 126 and others) are supported, and mail can be read on the island.
- **AI agents**: Claude Code / Claude desktop, Codex and DeepSeek Harness (DSH) sessions appear live on the island; approve or deny command and file-edit requests right there, get a quiet ping when a task finishes or waits for your answer, and click a session to jump to its window. Claude/Codex quota rings and the DSH balance ring are shown too. See [agent status](docs/agent-status-hooks.md) and [DSH integration](docs/deepseek-harness.md).
- **Music and lyrics**: control playback through Windows media sessions, with cover art, waveform, progress and synced lyrics; the collapsed island can show the current line. Reorder players by priority and archive the ones you rarely use. For NetEase Cloud, InfLink-rs and BetterNCM can be installed from the island card or Settings → Music → player compatibility.
- **File shelf**: drop files on the island to hold them, then drag, copy or open them in another window; only paths are recorded, files are not copied. See [file shelf](docs/file-shelf.md).
- **Clipboard history**: keep copied text and images, search content or notes, favourite the ones you reuse, and copy them back with one click.
- **Quick translation**: open translation with a global shortcut, using DeepSeek, Volcano Ark, Qwen, Kimi, SiliconFlow, OpenAI or a custom OpenAI-compatible endpoint; the language direction is detected or set manually.
- **Tasks, notes and calendar**: manage the day's tasks, pick the current one and reorder by dragging; schedule tasks for a later day, see which days have tasks in the calendar, optionally roll over unfinished work, and save tasks and notes as Markdown.
- **Appearance and behaviour**: classic or liquid-glass look, default or pixel font, adjustable size, opacity, colours and position, whole-look presets, position lock, edge hiding when idle, game mode, launch at login, and a Chinese or English interface.

Tasks, clipboard and settings stay on this machine. WeChat conversation names and message previews (experimental) and QQ notifications live only in memory for the current run. Mail syncs headers in the background and reads bodies on demand, keeping them in memory without changing read state.

### Differences from upstream

**New features** (not in upstream):

- **System page**: CPU, memory and network rates read straight from the machine, with no extra monitor installed.
- **Windows notifications from every application**: not just QQ. DSH, WorkBuddy and anything else land in the Notifications tab. Another application's toast only bumps a badge — it never slides the island open over what you are doing.
- **System volume**: the music page sets the Windows output level, kept separate from track progress, so it works with any player and with nothing playing.

**Changed**:

- Game mode gained a switch that asks for the quiet outright: hovering does nothing and a click opens the island, windowed games included.
- The default colour scheme is light (white surface, dark text), and the island's grey blocks and accent colour go through one tone channel that follows dark mode automatically.
- About keeps only the GPL-3.0 attribution; the upstream community group, star prompt and tip jar are gone.

**Other**:

- Branding and executable name are **LFC-ISLET**; window titles, installer publisher and the application id (`com.lfcislet.island`) follow, with existing data migrated.
- **In-app auto-update is disabled**: the update endpoints are empty so this fork cannot be overwritten by an upstream release. To update, pull this repository and rebuild.

## Getting started

After expanding the island, use the page buttons at the top to switch between tasks, music, clipboard, file shelf, translation, messages and AI agents. On the collapsed island, click the agent indicator or session count for the agent page, the player waveform for music, the file count for the shelf, and the middle text to return to the page you left. Settings open as one of the island's pages with a category sidebar; Settings → General → separate settings window detaches it.

### Feature setup

- **QQ and WeChat reminders**: on by default. QQ needs Windows notification access and a signed-in QQ with system notifications enabled; WeChat needs the desktop client signed in and posting taskbar alerts.
- **Agent status lights**: install or repair the Codex / Claude Code hooks in Settings → connect AI tools, then restart Codex or the terminal running Claude Code.
- **Mail**: enable IMAP on the provider's website and generate an app password, then enter the address and that password (not your login password) in Settings → Mail. Credentials go to Windows Credential Manager.
- **Quick translation**: `Ctrl+Shift+F` by default. Pick a service and enter an API key in Settings → Translation; the key is stored in Windows Credential Manager, and the source text is sent to the service you choose.
- **Clipboard and file shelf**: adjust recording, image capture, history size and the summon shortcut in Settings → Clipboard and files.

### Tech stack

- Tauri 2: Windows shell and native capabilities
- React 19 + TypeScript: interface and interaction
- Rust: window, shortcut, clipboard, media and file capabilities
- pnpm: dependencies and project scripts

## Development and build

You need Windows 10/11, plus:

- **Node.js 22 or newer** and **pnpm 10 or newer**
- **Rust**: the version is pinned by `rust-toolchain.toml` (currently 1.99.1); with rustup installed it is selected automatically
- **Visual Studio C++ Build Tools** (the MSVC toolchain Tauri needs to compile Rust)
- **WebView2 runtime** (built into Windows 11; install it on Windows 10 if missing)

```powershell
# Replace the address with the repository you want to clone.
git clone https://github.com/<your-name>/LFC-ISLET.git
cd LFC-ISLET
pnpm install
pnpm tauri dev
```

Run the full check:

```powershell
pnpm check
```

### Build a release

```powershell
pnpm tauri build
```

The installers land in:

- `src-tauri/target/release/bundle/nsis/LFC-ISLET_<version>_x64-setup.exe`
- `src-tauri/target/release/bundle/msi/LFC-ISLET_<version>_x64_en-US.msi`

The in-app update flow (signing and publishing `latest.json`) is described in the upstream [docs/updater.md](docs/updater.md). This fork ships it disabled; enabling it means generating your own key and filling in `plugins.updater.pubkey` and `endpoints`.

## Contributors

- Original project: [fly-island](https://github.com/flyl1u/fly-island) by [@flyl1u](https://github.com/flyl1u). The bulk of the functionality comes from upstream.
- Upstream credits [@TixXin](https://github.com/TixXin) for the modular architecture proposed and implemented in [PR #36](https://github.com/flyl1u/fly-island/pull/36); see the [refactor notes](docs/architecture/refactor-plan.md).

## License

This project keeps the upstream [GNU General Public License v3.0](LICENSE). You may use, modify and redistribute it; redistributed modified versions must stay GPL-3.0 with source available.

Copyright (C) 2026 flyl1u and contributors (upstream). LFC-ISLET's changes are released under GPL-3.0 as well.

Third-party dependencies and bundled assets keep their own licenses. Font licensing is in [the font notes](src/assets/fonts/README.md). The bundled NetEase progress plugins BetterNCM and InfLink-rs are GPL-3.0, shipped unmodified, with licenses and source links in [the plugin notes](src-tauri/resources/media-plugins/README.md).

### Plugin development

> **Note**: this fork ships **no plugin index**, so the plugin list in Settings starts empty and nothing is fetched from upstream. To install plugins, point the developer-mode index field at your own build, or set `FOCUSD_PLUGINS_INDEX`. The plugin system itself is complete; there is simply no official marketplace.

Start from the example and debug locally; see the [plugin guide](docs/plugins/quickstart.md).
