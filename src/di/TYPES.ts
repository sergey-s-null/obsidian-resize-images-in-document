import "reflect-metadata";

const TYPES = {
	Plugin: Symbol.for("Plugin"),
	SettingsProvider: Symbol.for("SettingsProvider"),
	MarkdownExtractorService: Symbol.for("MarkdownExtractorService"),
	ImageResizeService: Symbol.for("ImageResizeService"),
}

export { TYPES };
