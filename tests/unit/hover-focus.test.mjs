import assert from "node:assert/strict";
import test from "node:test";
import { hoverFocusAction } from "../../src/windows/island/hoverFocus.ts";
import { gameModeEffects } from "../../src/windows/island/gameMode.ts";

const state = (overrides) => ({ expanded: true, hovering: true, editing: false, blocked: false, ...overrides });

test("the expanded panel under the cursor takes the focus", () => {
  assert.equal(hoverFocusAction(state()), "take");
});

test("the collapsed island never takes the focus and hands back any it holds", () => {
  assert.equal(hoverFocusAction(state({ expanded: false })), "release");
  assert.equal(hoverFocusAction(state({ expanded: false, editing: true })), "release");
});

test("leaving the expanded panel hands the focus back", () => {
  assert.equal(hoverFocusAction(state({ hovering: false })), "release");
});

test("a draft keeps the focus while the panel stays open", () => {
  assert.equal(hoverFocusAction(state({ hovering: false, editing: true })), "none");
});

test("game mode stops the island taking the focus but still lets it go", () => {
  assert.equal(hoverFocusAction(state({ blocked: true })), "none");
  assert.equal(hoverFocusAction(state({ blocked: true, hovering: false })), "release");
});

const here = { active: true, onIslandMonitor: true };
const elsewhere = { active: true, onIslandMonitor: false };
const both = { gameModeAlways: false, gameDoNotDisturb: true, gameAutoTuck: true };

test("game mode only acts while a full-screen app is in front", () => {
  assert.deepEqual(gameModeEffects({ active: false, onIslandMonitor: false }, both), { quiet: false, tuck: false });
  assert.deepEqual(gameModeEffects(here, { gameModeAlways: false, gameDoNotDisturb: true, gameAutoTuck: false }), { quiet: true, tuck: false });
  assert.deepEqual(gameModeEffects(here, { gameModeAlways: false, gameDoNotDisturb: false, gameAutoTuck: true }), { quiet: false, tuck: true });
});

test("a game on another monitor keeps the island quiet but not tucked", () => {
  assert.deepEqual(gameModeEffects(elsewhere, both), { quiet: true, tuck: false });
});

test("the switch quiets the island with nothing full-screen in front", () => {
  const nothing = { active: false, onIslandMonitor: false };
  const manual = { gameModeAlways: true, gameDoNotDisturb: true, gameAutoTuck: true };
  assert.deepEqual(gameModeEffects(nothing, manual), { quiet: true, tuck: false });
  // Tucking still waits for a full-screen app: out of game mode, an always-tucked
  // island would be out of reach with no game to justify it.
  assert.deepEqual(gameModeEffects(here, manual), { quiet: true, tuck: true });
});
