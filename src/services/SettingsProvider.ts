import { PluginSettings } from "../PluginSettings";

export interface SettingsProvider {
	getSettings(): Promise<PluginSettings>;

	saveSettings(): Promise<void>;
}
