import { SettingsProvider } from "./SettingsProvider";
import { PluginSettings } from "./PluginSettings";
import { Plugin } from "obsidian";
import { DefaultPluginSettings } from "./DefaultPluginSettings";

export class SettingsProviderImpl implements SettingsProvider {
	private readonly plugin: Plugin;

	private settingsLoadingPromise: Promise<PluginSettings> | null;
	private settings: PluginSettings | null;

	public constructor(plugin: Plugin) {
		this.plugin = plugin;

		this.settingsLoadingPromise = this.loadSettings();
	}

	public async getSettings(): Promise<PluginSettings> {
		if (this.settings) {
			return this.settings;
		}

		if (this.settingsLoadingPromise) {
			this.settings = await this.settingsLoadingPromise;
			this.settingsLoadingPromise = null;
		}

		return this.settings!;
	}

	public async saveSettings(): Promise<void> {
		const settings = await this.getSettings();
		await this.plugin.saveData(settings);
	}

	private async loadSettings(): Promise<PluginSettings> {
		const data = await this.plugin.loadData();
		return Object.assign({}, DefaultPluginSettings, data);
	}
}
