import { Container } from "inversify";
import { SettingsProviderImpl } from "../services/implementations/SettingsProviderImpl";
import { SettingsProvider } from "../services/SettingsProvider";
import { TYPES } from "./types";
import { App, Plugin } from "obsidian";
import { ImageResizeService } from "../services/ImageResizeService";
import { ImageResizeServiceImpl } from "../services/implementations/ImageResizeServiceImpl";
import { MarkdownExtractorService } from "../services/MarkdownExtractorService";
import { MarkdownExtractorServiceImpl } from "../services/implementations/MarkdownExtractorServiceImpl";
import { PluginActions } from "../services/PluginActions";
import { PluginActionsImpl } from "../services/implementations/PluginActionsImpl";
import { PluginSettingsTab } from "../settings_tabs/PluginSettingsTab";
import { PluginSettingsTabFactory } from "../factories/PluginSettingsTabFactory";
import { VaultPathsFixerImpl } from "../services/implementations/VaultPathsFixerImpl";
import { VaultPathsFixer } from "../services/VaultPathsFixer";

function createContainer(app: App, plugin: Plugin): Container {
	const pluginContainer = new Container();

	pluginContainer
		.bind<App>(TYPES.App)
		.toConstantValue(app);
	pluginContainer
		.bind<Plugin>(TYPES.Plugin)
		.toConstantValue(plugin);

	pluginContainer
		.bind<PluginActions>(TYPES.PluginActions)
		.to(PluginActionsImpl)
		.inSingletonScope();
	pluginContainer
		.bind<SettingsProvider>(TYPES.SettingsProvider)
		.to(SettingsProviderImpl)
		.inSingletonScope();
	pluginContainer
		.bind<MarkdownExtractorService>(TYPES.MarkdownExtractorService)
		.to(MarkdownExtractorServiceImpl)
		.inSingletonScope();
	pluginContainer
		.bind<ImageResizeService>(TYPES.ImageResizeService)
		.to(ImageResizeServiceImpl)
		.inSingletonScope();
	pluginContainer
		.bind<VaultPathsFixer>(TYPES.VaultPathsFixer)
		.to(VaultPathsFixerImpl)
		.inSingletonScope();

	pluginContainer
		.bind<PluginSettingsTabFactory>(TYPES.PluginSettingsTabFactory)
		.toFactory(context => {
			return () => {
				return new PluginSettingsTab(
					context.container.get<App>(TYPES.App),
					context.container.get<Plugin>(TYPES.Plugin),
					context.container.get<SettingsProvider>(TYPES.SettingsProvider)
				);
			};
		});

	return pluginContainer;
}

export { createContainer };
