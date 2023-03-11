import "reflect-metadata";

const TYPES = {
	App: Symbol.for("App"),
	Plugin: Symbol.for("Plugin"),
	PluginActions: Symbol.for("PluginActions"),
	SettingsProvider: Symbol.for("SettingsProvider"),
	MarkdownExtractorService: Symbol.for("MarkdownExtractorService"),
	ImageResizeService: Symbol.for("ImageResizeService"),
	PluginSettingsTabFactory: Symbol.for("PluginSettingsTabFactory"),
	VaultPathsFixer: Symbol.for("VaultPathsFixer"),
}

export { TYPES };
