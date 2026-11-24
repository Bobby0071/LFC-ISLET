import assert from "node:assert/strict";
import test from "node:test";
import { clampVolume, shownVolume } from "../../src/features/media/volumeLevel.ts";

test("a normal level maps straight through, rounded", () => {
  assert.equal(shownVolume(0), 0);
  assert.equal(shownVolume(35), 35);
  assert.equal(shownVolume(100), 100);
  assert.equal(shownVolume(42.4), 42);
  assert.equal(shownVolume(42.6), 43);
});

test("out-of-range levels are clamped to the slider", () => {
  assert.equal(shownVolume(140), 100);
});

test("a device the backend could not read is not drawn as muted", () => {
  // The backend reports -1 when the default output device cannot be opened. Drawing that as
  // 0% would say "muted", which is a different and wrong statement about the machine.
  assert.equal(shownVolume(-1), null);
  assert.equal(shownVolume(-0.5), null);
});
