import { Container } from "inversify";
import { SettingsProviderImpl } from "../SettingsProviderImpl";
import { SettingsProvider } from "../SettingsProvider";
import { TYPES } from "./TYPES";
import { Plugin } from "obsidian";

function createContainer(plugin: Plugin): Container {
	const pluginContainer = new Container();

	pluginContainer
		.bind<Plugin>(TYPES.Plugin)
		.toConstantValue(plugin);

	pluginContainer
		.bind<SettingsProvider>(TYPES.SettingsProvider)
		.to(SettingsProviderImpl)
		.inSingletonScope();

	return pluginContainer;
}

export { createContainer };
