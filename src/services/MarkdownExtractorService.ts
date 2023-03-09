export interface MarkdownExtractorService {
	extractImagesPaths(markdownContent: string): Promise<string[]>;
}
