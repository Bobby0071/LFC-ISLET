import { useTranslation } from "../../i18n";
import { barFraction, formatMemoryPair, formatPercent, formatRate, meterLevel } from "./format";
import type { SystemStats } from "./api";
import "./SystemPanel.css";

/** One labelled reading with a bar; `detail` carries the secondary figure. */
function Meter({
  label,
  value,
  fraction,
  detail,
}: {
  label: string;
  value: string;
  fraction: number;
  detail?: string;
}) {
  const level = meterLevel(fraction);
  return (
    <div className="system-meter">
      <div className="system-meter__head">
        <span className="system-meter__label">{label}</span>
        <span className="system-meter__value">{value}</span>
      </div>
      <div
        className="system-meter__track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(fraction * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="system-meter__fill" data-level={level} style={{ width: `${fraction * 100}%` }} />
      </div>
      {detail ? <span className="system-meter__detail">{detail}</span> : null}
    </div>
  );
}

/** CPU, memory and network rates for the machine running the island. */
export function SystemPanel({ stats, failed }: { stats: SystemStats | null; failed: boolean }) {
  const t = useTranslation();

  if (!stats) {
    // The first sample only arrives after the backend has baselined its counters. The
    // message holds the first row's place, so the readings land where it stood instead
    // of the panel starting centred and then jumping up (one top edge, always).
    return (
      <div className="system-panel system-panel--empty">
        <span className={failed ? "system-panel__warning" : undefined} role="status">
          {failed ? t.system.refreshFailed : t.system.sampling}
        </span>
      </div>
    );
  }

  return (
    <div className="system-panel">
      <Meter
        label={t.system.cpu}
        value={formatPercent(stats.cpu)}
        fraction={barFraction(stats.cpu)}
      />
      <Meter
        label={t.system.memory}
        value={formatPercent(stats.memory)}
        fraction={barFraction(stats.memory)}
        detail={formatMemoryPair(stats.memoryUsedBytes, stats.memoryTotalBytes)}
      />
      <div className="system-panel__rates">
        <div className="system-rate">
          <span className="system-rate__label">{t.system.download}</span>
          <span className="system-rate__value">{formatRate(stats.networkRx)}</span>
        </div>
        <div className="system-rate">
          <span className="system-rate__label">{t.system.upload}</span>
          <span className="system-rate__value">{formatRate(stats.networkTx)}</span>
        </div>
      </div>
      {/* Polite, not assertive: a failed poll is news, not an emergency, and it repeats each second. */}
      {failed ? (
        <span className="system-panel__warning" role="status">{t.system.refreshFailed}</span>
      ) : null}
    </div>
  );
}
