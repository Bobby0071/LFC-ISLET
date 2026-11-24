import assert from "node:assert/strict";
import test from "node:test";
import { barFraction, formatBytes, formatMemoryPair, formatPercent, formatRate, meterLevel } from "../../src/features/system/format.ts";

test("byte sizes pick a unit and drop noise digits", () => {
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(1024), "1.0 KB");
  assert.equal(formatBytes(1536), "1.5 KB");
  assert.equal(formatBytes(1024 * 1024 * 1024 * 2), "2.0 GB");
  // Three digits need no decimal; the reading is already precise enough.
  assert.equal(formatBytes(1024 * 200), "200 KB");
});

test("a missing or negative value is not printed as a size", () => {
  assert.equal(formatBytes(-5), "0 B");
  assert.equal(formatBytes(Number.NaN), "0 B");
});

test("rates append a per-second unit, and a first sample shows a dash", () => {
  assert.equal(formatRate(null), "—");
  assert.equal(formatRate(0), "0 B/s");
  assert.equal(formatRate(2048), "2.0 KB/s");
  assert.equal(formatRate(-1), "—");
});

test("a rate keeps its unit across the 1024 boundary instead of jumping", () => {
  // The byte formatter would print "1.0 MB/s" here; the rate formatter stays in KB.
  assert.equal(formatRate(1024), "1.0 KB/s");
  assert.equal(formatRate(1023 * 1024), "1023 KB/s");
  assert.equal(formatRate(1000 * 1024), "1000 KB/s");
  // Past a thousand of a unit it steps up, so the figure never grows without bound.
  assert.equal(formatRate(1024 * 1024), "1.0 MB/s");
});

test("percentages round, and an unknown reading stays a dash", () => {
  assert.equal(formatPercent(0), "0%");
  assert.equal(formatPercent(12.4), "12%");
  assert.equal(formatPercent(99.6), "100%");
  assert.equal(formatPercent(null), "—");
});

test("the memory row reads used of total", () => {
  const gb = 1024 * 1024 * 1024;
  assert.equal(formatMemoryPair(12 * gb, 32 * gb), "12.0 GB / 32.0 GB");
  // A zero total would divide the bar by zero, so it reads as unknown instead.
  assert.equal(formatMemoryPair(0, 0), "—");
});

test("a bar only turns warm or hot near its ceiling", () => {
  assert.equal(meterLevel(0), "normal");
  assert.equal(meterLevel(0.649), "normal");
  assert.equal(meterLevel(0.65), "warm");
  assert.equal(meterLevel(0.849), "warm");
  assert.equal(meterLevel(0.85), "high");
  assert.equal(meterLevel(1), "high");
  // A broken reading must not light the bar up as if the machine were on fire.
  assert.equal(meterLevel(Number.NaN), "normal");
});

test("bar fractions stay inside their track", () => {
  assert.equal(barFraction(0), 0);
  assert.equal(barFraction(50), 0.5);
  assert.equal(barFraction(100), 1);
  assert.equal(barFraction(140), 1);
  assert.equal(barFraction(-20), 0);
  assert.equal(barFraction(null), 0);
});
