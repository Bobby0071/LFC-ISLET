//! Launch at startup through the current user's Run key.

use std::{os::windows::process::CommandExt, process::Command};

use super::CREATE_NO_WINDOW;

pub(super) const STARTUP_REGISTRY_KEY: &str = r"HKCU\Software\Microsoft\Windows\CurrentVersion\Run";
pub(super) const STARTUP_REGISTRY_VALUE: &str = "LFC-ISLET";
/// The value this fork used while it still carried the upstream name. Left over in the Run key
/// of anyone who launched that build, so it is cleared whenever the switch is written: otherwise
/// turning "launch at startup" off would leave that entry starting the old executable.
const LEGACY_STARTUP_REGISTRY_VALUE: &str = "FocuSD Island";

#[tauri::command]
pub fn get_launch_at_startup() -> Result<bool, String> {
    let mut command = Command::new("reg");
    let status = command
        .creation_flags(CREATE_NO_WINDOW)
        .args(["query", STARTUP_REGISTRY_KEY, "/v", STARTUP_REGISTRY_VALUE])
        .status()
        .map_err(|error| format!("Failed to query startup registry: {error}"))?;

    Ok(status.success())
}

#[tauri::command]
pub fn set_launch_at_startup(enabled: bool) -> Result<(), String> {
    let status = if enabled {
        let current_exe = std::env::current_exe()
            .map_err(|error| format!("Failed to resolve current executable: {error}"))?;
        let startup_value = format!("\"{}\"", current_exe.display());

        let mut command = Command::new("reg");
        command
            .creation_flags(CREATE_NO_WINDOW)
            .args([
                "add",
                STARTUP_REGISTRY_KEY,
                "/v",
                STARTUP_REGISTRY_VALUE,
                "/t",
                "REG_SZ",
                "/d",
            ])
            .arg(startup_value)
            .arg("/f")
            .status()
    } else {
        let mut command = Command::new("reg");
        command
            .creation_flags(CREATE_NO_WINDOW)
            .args([
                "delete",
                STARTUP_REGISTRY_KEY,
                "/v",
                STARTUP_REGISTRY_VALUE,
                "/f",
            ])
            .status()
    }
    .map_err(|error| format!("Failed to update startup registry: {error}"))?;

    if !status.success() {
        return Err("Startup registry command failed.".to_string());
    }
    clear_legacy_startup_entry();
    Ok(())
}

/// Drops the pre-rename Run value. Failure is ignored on purpose: a machine that never ran the
/// old build has nothing to clear, and `reg delete` reports an error for a missing value.
fn clear_legacy_startup_entry() {
    let _ = Command::new("reg")
        .creation_flags(CREATE_NO_WINDOW)
        .args([
            "delete",
            STARTUP_REGISTRY_KEY,
            "/v",
            LEGACY_STARTUP_REGISTRY_VALUE,
            "/f",
        ])
        .status();
}
