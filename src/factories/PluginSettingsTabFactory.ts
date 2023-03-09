import { interfaces } from "inversify";
import { PluginSettingsTab } from "../settings_tabs/PluginSettingsTab";

export type PluginSettingsTabFactory = interfaces.Factory<PluginSettingsTab>;
