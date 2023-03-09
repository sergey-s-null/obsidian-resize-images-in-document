import { App, Plugin, PluginSettingTab as PluginSettingTabBase, Setting } from "obsidian";
import { SettingsProvider } from "../services/SettingsProvider";

export class PluginSettingsTab extends PluginSettingTabBase {
	private readonly settingsProvider: SettingsProvider;

	public constructor(
		app: App,
		plugin: Plugin,
		settingsProvider: SettingsProvider
	) {
		super(app, plugin);

		this.settingsProvider = settingsProvider;
	}

	async display(): Promise<void> {
		const { containerEl } = this;

		const settings = await this.settingsProvider.getSettings();

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName("Images target width")
			.setDesc("Width to which images should be resized")
			.addText(text => text
				.setPlaceholder('Enter width')
				.setValue(settings.imageTargetWidth)
				.onChange(async (value) => {
					settings.imageTargetWidth = value;
					await this.settingsProvider.saveSettings();
				}));
	}
}
