export interface MarkdownExtractorService {
	extractAttachmentsPaths(markdownContent: string): string[];
}
