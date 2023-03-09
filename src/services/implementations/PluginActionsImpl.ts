import { PluginActions } from "../PluginActions";
import { App, FileSystemAdapter, Notice } from "obsidian";
import { AskForResizeImagesInFileModal } from "../../modals/AskForResizeImagesInFileModal";
import { SettingsProvider } from "../SettingsProvider";
import { MarkdownExtractorService } from "../MarkdownExtractorService";
import { ImageResizeService } from "../ImageResizeService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/TYPES";

@injectable()
export class PluginActionsImpl implements PluginActions {
	private readonly app: App;
	private readonly settingsProvider: SettingsProvider;
	private readonly markdownExtractorService: MarkdownExtractorService;
	private readonly imageResizeService: ImageResizeService;

	public constructor(
		@inject(TYPES.App) app: App,
		@inject(TYPES.SettingsProvider) settingsProvider: SettingsProvider,
		@inject(TYPES.MarkdownExtractorService) markdownExtractorService: MarkdownExtractorService,
		@inject(TYPES.ImageResizeService) imageResizeService: ImageResizeService,
	) {
		this.app = app;
		this.settingsProvider = settingsProvider;
		this.markdownExtractorService = markdownExtractorService;
		this.imageResizeService = imageResizeService;
	}


	public async resizeImagesInCurrentDocument(): Promise<void> {
		if (!(this.app.vault.adapter instanceof FileSystemAdapter)) {
			new Notice("Error: could not resize images on mobile system.");
			return;
		}

		const filePath = this.app.workspace.activeEditor?.file?.path;
		if (!filePath) {
			new Notice("Document is not opened.");
			return;
		}

		const fileContent = this.app.workspace.activeEditor?.editor?.getDoc()?.getValue();
		if (!fileContent) {
			new Notice("Document is not opened or document content is empty.");
			return;
		}

		const { imageTargetWidth } = await this.settingsProvider.getSettings();

		new AskForResizeImagesInFileModal(
			this.app,
			{
				filePath: filePath,
				defaultImageTargetWidth: imageTargetWidth
			},
			async values => {
				await this.saveImageTargetWidth(values.imageTargetWidth);

				await this.resizeAttachedImages(fileContent);
			})
			.open();
	}

	private async saveImageTargetWidth(width: number) {
		const settings = await this.settingsProvider.getSettings();
		settings.imageTargetWidth = width.toString();
		await this.settingsProvider.saveSettings();
	}

	private async resizeAttachedImages(fileContent: string) {
		const imagesPaths = await this.markdownExtractorService.extractImagesPaths(fileContent);
		if (imagesPaths.length == 0) {
			new Notice("Nothing to resize.");
			return;
		}

		const imagesAbsolutePaths = this.mapToAbsolutePaths(imagesPaths);
		const targetWidth = await this.getTargetWidth();
		const results = await this.imageResizeService.resizeBatch(imagesAbsolutePaths, targetWidth);
		// todo display results
	}

	private mapToAbsolutePaths(vaultPaths: string[]) {
		const fileSystemAdapter = this.app.vault.adapter as FileSystemAdapter;
		return vaultPaths.map(x => fileSystemAdapter.getFullPath(x));
	}

	private async getTargetWidth() {
		const { imageTargetWidth } = await this.settingsProvider.getSettings();
		return Number(imageTargetWidth);
	}
}
