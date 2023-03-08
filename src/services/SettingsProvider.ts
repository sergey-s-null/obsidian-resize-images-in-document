import { PluginSettings } from "../entities/PluginSettings";

export interface SettingsProvider {
	getSettings(): Promise<PluginSettings>;

	saveSettings(): Promise<void>;
}
