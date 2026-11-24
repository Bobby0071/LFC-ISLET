//! One-time move of the data an earlier build left under the upstream identifier.
//!
//! This fork used to ship `com.focusd.island` — the same identifier as upstream
//! fly-island — so the two apps shared a data directory and could not run at the
//! same time (the single-instance lock is named after the identifier). The
//! identifier is now `com.lfcislet.island`; this module copies what the old
//! identifier left behind so settings, sessions and clipboard history survive.
//!
//! It only ever copies into an empty destination: a fresh install must never have
//! the old app's data dropped on top of settings the user already changed here.
//! The legacy directory is left in place, so downgrading still works.
//!
//! Two saved files record absolute paths (`plugins-state.json` and
//! `clipboard-history.json`). Copied verbatim they point back into the legacy
//! directory, and the plugin host then rejects the plugin as an unsafe directory
//! while clipboard rows lose their images — so the copied text has its legacy
//! prefix replaced with the new one.

use std::path::{Path, PathBuf};

const LEGACY_IDENTIFIER: &str = "com.focusd.island";
const CURRENT_IDENTIFIER: &str = "com.lfcislet.island";

/// Runs before anything reads the data directory. A failure is logged and
/// ignored: not migrating costs a user their old settings, but aborting startup
/// costs them the app.
pub fn migrate_legacy_data() {
    for directory in [dirs_roaming(), dirs_local()] {
        let Some(base) = directory else { continue };
        let from = base.join(LEGACY_IDENTIFIER);
        let to = base.join(CURRENT_IDENTIFIER);
        match copy_if_absent(&from, &to) {
            Ok(0) => {}
            Ok(copied) => eprintln!("migrated {copied} files from {}", from.display()),
            Err(error) => eprintln!("could not migrate {}: {error}", from.display()),
        }
    }
}

fn dirs_roaming() -> Option<PathBuf> {
    std::env::var_os("APPDATA").map(PathBuf::from)
}

fn dirs_local() -> Option<PathBuf> {
    std::env::var_os("LOCALAPPDATA").map(PathBuf::from)
}

/// Copies every file under `from` into `to` that `to` does not have yet.
/// Returns how many files were copied. A destination file always wins.
fn copy_if_absent(from: &Path, to: &Path) -> std::io::Result<usize> {
    if !from.is_dir() {
        return Ok(0);
    }
    // A marker means this build has already run here; copying again would
    // resurrect settings the user has since changed or reset.
    let done = to.join(MARKER);
    if done.exists() {
        return Ok(0);
    }
    let copied = copy_tree(from, to)?;
    rewrite_legacy_paths(from, to);
    // Written even when nothing matched, so an install that never used the old
    // identifier does not scan again on every launch.
    let _ = std::fs::write(&done, b"migrated from com.focusd.island\n");
    Ok(copied)
}

fn copy_tree(from: &Path, to: &Path) -> std::io::Result<usize> {
    std::fs::create_dir_all(to)?;
    let mut copied = 0;
    for entry in std::fs::read_dir(from)? {
        let entry = entry?;
        let target = to.join(entry.file_name());
        let kind = entry.file_type()?;
        if kind.is_dir() {
            // WebView2's cache is large and rebuilds itself; the localStorage and
            // IndexedDB inside it are what carry settings, so they are kept.
            if entry.file_name() == "EBWebView" {
                copied += copy_webview(&entry.path(), &target)?;
            } else {
                copied += copy_tree(&entry.path(), &target)?;
            }
        } else if kind.is_file() && !target.exists() {
            // A WebView2 cache can be open in the old app; a copy failure on one
            // file must not stop the rest.
            match std::fs::copy(entry.path(), &target) {
                Ok(_) => copied += 1,
                Err(error) => eprintln!("skipped {}: {error}", entry.path().display()),
            }
        }
    }
    Ok(copied)
}

/// Files that embed absolute paths to the data directory. Rewriting is done as
/// text so a field this version does not know about is still corrected.
const PATH_BEARING_FILES: [&str; 2] = ["plugins-state.json", "clipboard-history.json"];

fn rewrite_legacy_paths(from: &Path, to: &Path) {
    // JSON escapes backslashes, so the stored form is the OS path with every
    // separator doubled. Both forms are replaced: a hand-written file may use
    // forward slashes.
    let pairs = [
        (from.display().to_string(), to.display().to_string()),
        (
            from.display().to_string().replace('\\', "/"),
            to.display().to_string().replace('\\', "/"),
        ),
        (
            from.display().to_string().replace('\\', "\\\\"),
            to.display().to_string().replace('\\', "\\\\"),
        ),
    ];
    for name in PATH_BEARING_FILES {
        let path = to.join(name);
        let Ok(text) = std::fs::read_to_string(&path) else { continue };
        let mut updated = text.clone();
        for (old, new) in &pairs {
            if updated.contains(old.as_str()) {
                updated = updated.replace(old.as_str(), new.as_str());
            }
        }
        if updated != text {
            let _ = std::fs::write(&path, updated);
        }
    }
}

const MARKER: &str = ".migrated-from-focusd-island";

/// WebView2 keeps localStorage, IndexedDB and cookies beside several hundred
/// megabytes of caches that rebuild themselves. Only these carry state.
const WEBVIEW_STATE_DIRS: [&str; 4] = [
    "Default/Local Storage",
    "Default/IndexedDB",
    "Default/Session Storage",
    "Default/Network",
];

fn copy_webview(from: &Path, to: &Path) -> std::io::Result<usize> {
    let mut copied = 0;
    for name in WEBVIEW_STATE_DIRS {
        let source = from.join(name);
        if source.is_dir() {
            copied += copy_tree(&source, &to.join(name))?;
        }
    }
    Ok(copied)
}
