export interface ImageResizeResult {
	imagePath: string;
	result: "ok" | "skipped" | Error;
}
