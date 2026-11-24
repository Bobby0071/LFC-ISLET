// Runs before `pnpm tauri dev` starts the dev server. Another island instance blocks
// the dev build in two ways: the single-instance plugin makes the new process exit
// silently, and a running debug build locks the exe that cargo has to relink.
import { execFileSync } from "node:child_process";

// Repository builds are lfc-islet.exe; the installed app is named after productName.
// The last two names belong to upstream fly-island: this fork shared its data
// directory, so an upstream build may still be running here and would hold the
// single-instance lock. Killing them is intentional.
const IMAGE_NAMES = ["lfc-islet.exe", "LFC-ISLET.exe", "focusd-island.exe", "fly-island.exe"];
const EXIT_TIMEOUT_MS = 5_000;
const POLL_INTERVAL_MS = 100;

function runningImages() {
  return IMAGE_NAMES.filter((name) => {
    try {
      const output = execFileSync(
        "tasklist",
        ["/FI", `IMAGENAME eq ${name}`, "/FO", "CSV", "/NH"],
        { encoding: "latin1", windowsHide: true },
      );
      return output.toLowerCase().includes(`"${name}"`);
    } catch {
      return false;
    }
  });
}

const running = runningImages();

if (running.length > 0) {
  for (const name of running) {
    try {
      execFileSync("taskkill", ["/F", "/IM", name], { stdio: "ignore", windowsHide: true });
    } catch {
      // The process may already be gone; the wait below reports anything left over.
    }
  }

  // The plugin mutex and the exe lock are released only after the process fully exits.
  const deadline = Date.now() + EXIT_TIMEOUT_MS;
  while (runningImages().length > 0 && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  const remaining = runningImages();
  if (remaining.length > 0) {
    console.warn(`Could not stop running island instance: ${remaining.join(", ")}`);
  } else {
    console.log(`Stopped running island instance: ${running.join(", ")}`);
  }
}
