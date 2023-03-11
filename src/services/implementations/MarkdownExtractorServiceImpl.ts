import { MarkdownExtractorService } from "../MarkdownExtractorService";
import * as path from "path";
import { SettingsProvider } from "../SettingsProvider";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

@injectable()
export class MarkdownExtractorServiceImpl implements MarkdownExtractorService {
	private readonly settingsProvider: SettingsProvider;

	private readonly attachmentRegex = /!\[\[([^\[\]]*)]]/g;

	public constructor(
		@inject(TYPES.SettingsProvider) settingsProvider: SettingsProvider
	) {
		this.settingsProvider = settingsProvider;
	}

	public async extractImagesPaths(markdownContent: string): Promise<string[]> {
		const { supportedImageExtensions } = await this.settingsProvider.getSettings();

		return this.extractAttachmentsPaths(markdownContent)
			.filter(x => supportedImageExtensions.contains(path.extname(x)));
	}

	private extractAttachmentsPaths(markdownContent: string): string[] {
		return [...markdownContent.matchAll(this.attachmentRegex)].map(x => x[1]);
	}
}
