import { useSyncExternalStore } from "react";
import { GitFork } from "lucide-react";
import { SettingsGroup } from "../../components/settings/SettingsGroup";
import { useTranslation } from "../../i18n";
import markUrl from "../../../src-tauri/icons/mark.svg";
import { ProjectLink } from "./ProjectLink";
import { PROJECT_REPO_URL } from "./projectLinks";
import { getUpdateState, subscribeToUpdate } from "./updaterController";
import "./ProjectSettingsSection.css";

/** Settings → About, first: the island's mark, name, version and what it does. */
export function ProjectIdentitySection() {
  const t = useTranslation();
  const { version } = useSyncExternalStore(subscribeToUpdate, getUpdateState);

  return (
    <SettingsGroup>
      <div className="about-identity">
        <img className="about-identity__mark" src={markUrl} alt="" width={48} height={48} />
        <div className="about-identity__body">
          <div className="about-identity__heading">
            <p className="about-identity__name">{t.settings.project.appName}</p>
            {version && <span className="about-identity__version">{t.settings.project.versionChip(version)}</span>}
          </div>
          <p className="about-identity__description">{t.settings.project.description}</p>
        </div>
      </div>
    </SettingsGroup>
  );
}

/**
 * Settings → About → where the code came from. The upstream author's community
 * group, star link and tip jar pointed at flyl1u, not at this fork, so they are
 * gone; GPL-3.0 still requires the attribution to stay visible.
 */
export function ProjectLinksSection() {
  const text = useTranslation().settings.project;

  return (
    <SettingsGroup>
      <ProjectLink
        href={PROJECT_REPO_URL}
        tone="source"
        title={text.upstreamTitle}
        hint={text.upstreamHint}
        icon={<GitFork className="project-link__icon" size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
      />
      {/* GPL-3.0 §5(b): the modified copy itself must state that it is under this licence. */}
      <p className="project-link__license">{text.licenseNotice}</p>
    </SettingsGroup>
  );
}
