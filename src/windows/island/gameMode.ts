export type GameModeSettings = {
  /** Quiet on demand: the island opens on a click only, whatever is in front. */
  gameModeAlways: boolean;
  /** While a full-screen app is in front: no hover opening, no taking the focus, no message pop-ups. */
  gameDoNotDisturb: boolean;
  /** While a full-screen app fills the island's monitor: the island tucks to the top edge, and comes back after. */
  gameAutoTuck: boolean;
};

/** Same shape as ForegroundFullscreen in api.ts, kept here so tests can import this file alone. */
export type FullscreenState = { active: boolean; onIslandMonitor: boolean };

export type GameModeEffects = {
  /** Hold back hover opening, hover focus and message previews. */
  quiet: boolean;
  /** Keep the island tucked to the top edge. */
  tuck: boolean;
};

/**
 * What game mode does now. Quiet applies to a full-screen app on any monitor (taking
 * its focus would minimize a game wherever it is), and to the switch that asks for it
 * outright; tucking only when a full-screen app shares the island's monitor, since
 * elsewhere the island is not in its way.
 */
export function gameModeEffects(fullscreen: FullscreenState, settings: GameModeSettings): GameModeEffects {
  return {
    quiet: settings.gameModeAlways || (fullscreen.active && settings.gameDoNotDisturb),
    tuck: fullscreen.active && fullscreen.onIslandMonitor && settings.gameAutoTuck,
  };
}
