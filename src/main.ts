import { Plugin } from 'obsidian';
import { createContainer } from "./di/createContainer";
import { TYPES } from "./di/types";
import { PluginSettingsTab } from "./settings_tabs/PluginSettingsTab";
import { PluginSettingsTabFactory } from "./factories/PluginSettingsTabFactory";
import { PluginActions } from "./services/PluginActions";

export default class ResizeImagesInDocumentPlugin extends Plugin {
	async onload() {
		const container = createContainer(this.app, this);
		const pluginActions = container.get<PluginActions>(TYPES.PluginActions);

		this.addCommand({
			id: "resize-images-in-current-document",
			name: "Resize images in current document",
			callback: async () => {
				await pluginActions.resizeImagesInCurrentDocument();
			}
		});

		const pluginSettingsTabFactory = container.get<PluginSettingsTabFactory>(TYPES.PluginSettingsTabFactory);
		const pluginSettingsTab = pluginSettingsTabFactory() as PluginSettingsTab;
		this.addSettingTab(pluginSettingsTab);
	}
}
