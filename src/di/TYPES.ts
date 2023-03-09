import "reflect-metadata";

const TYPES = {
	Plugin: Symbol.for("Plugin"),
	SettingsProvider: Symbol.for("SettingsProvider"),
	ImageResizeService: Symbol.for("ImageResizeService"),
}

export { TYPES };
