import "reflect-metadata";
// todo rename file in lower case

const TYPES = {
	App: Symbol.for("App"),
	Plugin: Symbol.for("Plugin"),
	PluginActions: Symbol.for("PluginActions"),
	SettingsProvider: Symbol.for("SettingsProvider"),
	MarkdownExtractorService: Symbol.for("MarkdownExtractorService"),
	ImageResizeService: Symbol.for("ImageResizeService"),
	PluginSettingsTabFactory: Symbol.for("PluginSettingsTabFactory"),
}

export { TYPES };
