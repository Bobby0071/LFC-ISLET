import test from "node:test";
import assert from "node:assert/strict";
import { PLUGINS_ENABLED, MAIL_OTP_ENABLED } from "../../src/features/releaseFlags.ts";
import { SETTINGS_CATEGORIES, SETTINGS_GROUPS, settingsCategoryFor } from "../../src/windows/settings/categories.ts";
import { isPageEnabled, resolveMessageSource } from "../../src/windows/island/features.ts";
import { normalizeSettings } from "../../src/features/appearance/settings.ts";

test("unavailable features have no routes and preserve saved choices", () => {
  assert.equal(MAIL_OTP_ENABLED, false);
  // This build ships with the plugin flag on (release-features.json), so the
  // plugin pages and routes exist; mail OTP stays off.
  assert.equal(PLUGINS_ENABLED, true);
  assert.equal(SETTINGS_CATEGORIES.includes("plugins"), true);
  assert.equal(SETTINGS_GROUPS.some((group) => group.categories.includes("plugins")), true);
  assert.equal(settingsCategoryFor("plugins"), "plugins");
  const features = { todo: false, music: false, clipboard: false, shelf: false,
    agents: false, translation: false, qq: false, wechat: false, qqMail: false, plugin: true };
  // With the plugin flag on, the message page is always routable and a saved
  // "plugin" source wins over the built-in ones.
  assert.equal(isPageEnabled("qq", features), true);
  assert.equal(resolveMessageSource("plugin", { ...features, wechat: true }), "plugin");
  assert.equal(resolveMessageSource("plugin", features), "plugin");
  // A saved source that is off still falls back to the first one that is on.
  assert.equal(resolveMessageSource("plugin", { ...features, plugin: false, qqMail: true }), "qqMail");
  for (const autoCopyOtp of [true, false]) {
    assert.equal(normalizeSettings({ autoCopyOtp }).autoCopyOtp, autoCopyOtp);
  }
});
