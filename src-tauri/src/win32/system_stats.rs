//! Whole-machine CPU tick counts, memory usage and network byte totals.
//!
//! The raw Win32 calls live here because `unsafe` belongs in this module (AGENTS.md); the
//! system panel composes these readings into rates and never touches a pointer.

use windows::Win32::Foundation::FILETIME;
use windows::Win32::NetworkManagement::IpHelper::{
    FreeMibTable, GetIfTable2, IF_TYPE_SOFTWARE_LOOPBACK, MIB_IF_TABLE2,
};
use windows::Win32::NetworkManagement::Ndis::IfOperStatusUp;
use windows::Win32::System::SystemInformation::{GlobalMemoryStatusEx, MEMORYSTATUSEX};
use windows::Win32::System::Threading::GetSystemTimes;

/// Raw CPU tick counts. FILETIME counts 100-nanosecond ticks, so the caller
/// works in deltas and never needs the wall-clock meaning of the value.
#[derive(Debug, Clone, Copy)]
pub(crate) struct CpuTicks {
    pub(crate) idle: u64,
    pub(crate) kernel: u64,
    pub(crate) user: u64,
}

/// Joins high and low halves; keeping them apart would wrap at 32 bits.
fn join(time: FILETIME) -> u64 {
    ((time.dwHighDateTime as u64) << 32) | time.dwLowDateTime as u64
}

/// One reading of the machine-wide CPU counters.
pub(crate) fn cpu_ticks() -> Option<CpuTicks> {
    let mut idle = FILETIME::default();
    let mut kernel = FILETIME::default();
    let mut user = FILETIME::default();
    // SAFETY: all three pointers point at initialised FILETIME values.
    unsafe { GetSystemTimes(Some(&mut idle), Some(&mut kernel), Some(&mut user)) }.ok()?;
    Some(CpuTicks { idle: join(idle), kernel: join(kernel), user: join(user) })
}

/// Physical memory: (percent in use, bytes used, bytes total).
pub(crate) fn memory() -> (f32, u64, u64) {
    let mut status = MEMORYSTATUSEX {
        dwLength: std::mem::size_of::<MEMORYSTATUSEX>() as u32,
        ..Default::default()
    };
    // SAFETY: the struct is fully initialised and dwLength matches its size.
    if unsafe { GlobalMemoryStatusEx(&mut status) }.is_err() {
        return (0.0, 0, 0);
    }
    let total = status.ullTotalPhys;
    let used = total.saturating_sub(status.ullAvailPhys);
    let percent = if total == 0 { 0.0 } else { used as f32 / total as f32 * 100.0 };
    (percent, used, total)
}

/// Bytes received and sent over physical adapters, skipping loopback and adapters that are down.
pub(crate) fn network_totals() -> Option<(u64, u64)> {
    let mut table: *mut MIB_IF_TABLE2 = std::ptr::null_mut();
    // SAFETY: the call fills `table` with an API-owned table, released below.
    let status = unsafe { GetIfTable2(&mut table) };
    if status.is_err() || table.is_null() {
        return None;
    }
    let mut rx = 0u64;
    let mut tx = 0u64;
    // SAFETY: a successful call returns a valid table with `NumEntries` rows.
    unsafe {
        let rows = std::slice::from_raw_parts((*table).Table.as_ptr(), (*table).NumEntries as usize);
        for row in rows {
            if row.Type == IF_TYPE_SOFTWARE_LOOPBACK || row.OperStatus != IfOperStatusUp {
                continue;
            }
            rx = rx.saturating_add(row.InOctets);
            tx = tx.saturating_add(row.OutOctets);
        }
        FreeMibTable(table as *const core::ffi::c_void);
    }
    Some((rx, tx))
}
