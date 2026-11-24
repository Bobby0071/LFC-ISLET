import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "../../i18n";
import { clampVolume, shownVolume } from "./volumeLevel";
import "./MusicVolume.css";

/** How far an arrow key moves the volume. */
const KEY_STEP = 5;

type Props = {
  /** The Windows output level, 0-100. */
  value: number;
  onChange: (level: number) => void;
};



/**
 * The machine's output volume, under the music. A separate slider from the track's own progress
 * bar because it is a different thing: the player's slider moves through a song, this one turns
 * the speakers up. It drives the Windows endpoint, so it works with any player and still applies
 * when nothing is playing.
 */
export function MusicVolume({ value, onChange }: Props) {
  const t = useTranslation();
  const [dragging, setDragging] = useState(false);
  const level = shownVolume(value);
  // Nothing to show while the device is unreadable; the panel decides whether to mount this at all.
  if (level === null) return null;

  const pointerLevel = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    if (box.width <= 0) return level;
    return clampVolume(((event.clientX - box.left) / box.width) * 100);
  };
  const keyLevel = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = {
      ArrowLeft: level - KEY_STEP, ArrowDown: level - KEY_STEP,
      ArrowRight: level + KEY_STEP, ArrowUp: level + KEY_STEP,
      Home: 0, End: 100,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    onChange(clampVolume(target));
  };

  // The icon follows the level, so the row reads at a glance without the number.
  const Icon = level === 0 ? VolumeX : level < 50 ? Volume1 : Volume2;
  const style = { "--music-volume": `${level}%` } as CSSProperties;

  return (
    <div className={`music-volume${dragging ? " music-volume--dragging" : ""}`} style={style}>
      <button
        className="music-volume__icon"
        type="button"
        aria-label={level === 0 ? t.music.unmute : t.music.mute}
        onClick={() => onChange(level === 0 ? 60 : 0)}
      >
        <Icon size={15} strokeWidth={1.6} absoluteStrokeWidth />
      </button>
      <div
        className="music-volume__hit"
        role="slider"
        tabIndex={0}
        aria-label={t.music.volume}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={level}
        aria-valuetext={`${level}%`}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          if (event.button !== 0) return;
          event.preventDefault();
          try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* the drag still works over the bar */ }
          setDragging(true);
          onChange(pointerLevel(event));
        }}
        onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
          if (dragging) onChange(pointerLevel(event));
        }}
        onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
          if (!dragging) return;
          setDragging(false);
          onChange(pointerLevel(event));
        }}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={keyLevel}
      >
        <div className="music-volume__track">
          <span className="music-volume__fill" />
        </div>
      </div>
      <span className="music-volume__value">{level}</span>
    </div>
  );
}
