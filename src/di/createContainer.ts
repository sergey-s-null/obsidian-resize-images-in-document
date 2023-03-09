import { Container } from "inversify";
import { SettingsProviderImpl } from "../services/implementations/SettingsProviderImpl";
import { SettingsProvider } from "../services/SettingsProvider";
import { TYPES } from "./TYPES";
import { Plugin } from "obsidian";
import { ImageResizeService } from "../services/ImageResizeService";
import { ImageResizeServiceImpl } from "../services/implementations/ImageResizeServiceImpl";
import { MarkdownExtractorService } from "../services/MarkdownExtractorService";
import { MarkdownExtractorServiceImpl } from "../services/implementations/MarkdownExtractorServiceImpl";

function createContainer(plugin: Plugin): Container {
	const pluginContainer = new Container();

	pluginContainer
		.bind<Plugin>(TYPES.Plugin)
		.toConstantValue(plugin);

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

	return pluginContainer;
}

export { createContainer };
