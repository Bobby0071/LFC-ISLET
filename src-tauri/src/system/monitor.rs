//! CPU, memory and network readings for the island's system panel.
//!
//! Sampling is pull-based: nothing runs in the background, so an island that
//! never opens the panel costs nothing. CPU and network are rates, which need a
//! previous sample; the first call therefore only records a baseline and the
//! caller polls again a moment later (the panel polls every second and shows a
//! dash until it has two samples).

use serde::Serialize;
use std::sync::Mutex;
use std::time::Instant;

use crate::win32::system_stats::{self, CpuTicks};

#[derive(Serialize, Clone, Copy, Default)]
#[serde(rename_all = "camelCase")]
pub struct SystemStats {
    /// Whole-machine CPU load, 0-100. None until two samples exist.
    pub cpu: Option<f32>,
    /// Physical memory in use, 0-100.
    pub memory: f32,
    pub memory_used_bytes: u64,
    pub memory_total_bytes: u64,
    /// Bytes per second since the previous sample.
    pub network_rx: Option<f64>,
    pub network_tx: Option<f64>,
}

type CpuSample = CpuTicks;

fn cpu_sample() -> Option<CpuSample> {
    system_stats::cpu_ticks()
}

/// CPU load between two samples. Kernel time already includes idle time, so
/// busy = (kernel + user) - idle over the whole delta.
fn cpu_percent(previous: CpuSample, current: CpuSample) -> Option<f32> {
    let idle = current.idle.checked_sub(previous.idle)?;
    let kernel = current.kernel.checked_sub(previous.kernel)?;
    let user = current.user.checked_sub(previous.user)?;
    let total = kernel + user;
    if total == 0 {
        return None;
    }
    let busy = total.saturating_sub(idle);
    Some((busy as f32 / total as f32 * 100.0).clamp(0.0, 100.0))
}

fn memory() -> (f32, u64, u64) {
    system_stats::memory()
}

/// Totals over physical adapters, skipping loopback and adapters that are down.
fn network_totals() -> Option<(u64, u64)> {
    system_stats::network_totals()
}

#[derive(Default)]
struct Sampler {
    at: Option<Instant>,
    cpu: Option<CpuSample>,
    network: Option<(u64, u64)>,
}

static SAMPLER: Mutex<Option<Sampler>> = Mutex::new(None);

/// One reading. The first call after launch establishes the baseline, so its
/// rate fields are absent; the panel polls, so they appear on the next tick.
#[tauri::command]
pub fn get_system_stats() -> SystemStats {
    let now = Instant::now();
    let cpu = cpu_sample();
    let net = network_totals();
    let (memory_percent, memory_used, memory_total) = memory();

    let mut guard = match SAMPLER.lock() {
        Ok(guard) => guard,
        // A poisoned lock means an earlier call panicked while holding it. The
        // readings are still useful, so report them without rates.
        Err(poisoned) => poisoned.into_inner(),
    };
    let sampler = guard.get_or_insert_with(Sampler::default);

    let mut stats = SystemStats {
        cpu: None,
        memory: memory_percent,
        memory_used_bytes: memory_used,
        memory_total_bytes: memory_total,
        network_rx: None,
        network_tx: None,
    };

    if let (Some(previous), Some(current)) = (sampler.cpu, cpu) {
        stats.cpu = cpu_percent(previous, current);
    }
    if let (Some(previous_at), Some(previous_net), Some(current_net)) =
        (sampler.at, sampler.network, net)
    {
        let seconds = now.duration_since(previous_at).as_secs_f64();
        // Below about 200 ms the counter difference is mostly rounding noise.
        if seconds >= 0.2 {
            stats.network_rx =
                Some((current_net.0.saturating_sub(previous_net.0)) as f64 / seconds);
            stats.network_tx =
                Some((current_net.1.saturating_sub(previous_net.1)) as f64 / seconds);
        }
    }

    sampler.at = Some(now);
    sampler.cpu = cpu;
    sampler.network = net;
    stats
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample(idle: u64, kernel: u64, user: u64) -> CpuSample {
        CpuSample { idle, kernel, user }
    }

    #[test]
    fn a_fully_idle_machine_reads_zero() {
        // Kernel time already counts idle time, so a machine that did nothing
        // shows an idle delta equal to the whole kernel + user delta:
        // kernel 200, user 100, idle 300 of 300 total ticks.
        let percent = cpu_percent(sample(0, 100, 100), sample(300, 300, 200)).unwrap();
        assert_eq!(percent, 0.0);
    }

    #[test]
    fn a_fully_busy_machine_reads_one_hundred() {
        let percent = cpu_percent(sample(0, 100, 100), sample(0, 300, 200)).unwrap();
        assert_eq!(percent, 100.0);
    }

    #[test]
    fn half_busy_is_fifty() {
        // Delta: kernel 200, user 100, idle 150 of 300 total ticks.
        let percent = cpu_percent(sample(0, 100, 100), sample(150, 300, 200)).unwrap();
        assert!((percent - 50.0).abs() < 0.01, "{percent}");
    }

    #[test]
    fn identical_samples_report_nothing_instead_of_dividing_by_zero() {
        assert!(cpu_percent(sample(5, 5, 5), sample(5, 5, 5)).is_none());
    }

    #[test]
    fn a_counter_that_went_backwards_reports_nothing() {
        assert!(cpu_percent(sample(100, 100, 100), sample(1, 1, 1)).is_none());
    }

    #[test]
    fn memory_readings_are_plausible() {
        let (percent, used, total) = memory();
        assert!(total > 0, "no physical memory reported");
        assert!(used <= total);
        assert!((0.0..=100.0).contains(&percent));
    }

    #[test]
    fn every_reading_stays_in_range() {
        let stats = get_system_stats();
        assert!((0.0..=100.0).contains(&stats.memory));
        if let Some(cpu) = stats.cpu {
            assert!((0.0..=100.0).contains(&cpu));
        }
    }
}