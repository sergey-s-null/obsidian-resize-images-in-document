export interface VaultPathsFixer {
	/**
	 * Some attachments can be references by part of its path.
	 * E.g "image.png" can reference to "images/image.png".<br/>
	 * This method replace short paths to full.
	 * */
	fixPaths(paths: string[]): string[];
}
