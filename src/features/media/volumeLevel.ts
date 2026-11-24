/** Clamps a reported level to the slider's 0-100 range. */
export function clampVolume(level: number): number {
  return Math.min(100, Math.max(0, Math.round(level)));
}

/**
 * The level the volume slider draws, or null when there is nothing truthful to draw.
 *
 * The backend reports -1 when it could not open the default output device. Drawing that as 0%
 * would claim the machine is muted, which is a different and wrong statement, so it draws
 * nothing at all. Kept apart from the component so it can be tested without a DOM.
 */
export function shownVolume(value: number): number | null {
  return value < 0 ? null : clampVolume(value);
}
