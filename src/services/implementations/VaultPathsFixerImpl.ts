import { VaultPathsFixer } from "../VaultPathsFixer";
import { App, TFile } from "obsidian";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

@injectable()
export class VaultPathsFixerImpl implements VaultPathsFixer {
	private readonly app: App;

	public constructor(
		@inject(TYPES.App) app: App
	) {
		this.app = app;
	}

	public fixPaths(paths: string[]): string[] {
		const vaultFiles = this.app.vault.getFiles();

		return paths
			.map(x => this.fixPath(x, vaultFiles))
			.filter(x => x)
			.map(x => x as string);
	}

	private fixPath(path: string, vaultFiles: TFile[]) {
		const matchedVaultFile = vaultFiles.find(x => x.path.endsWith(path));
		if (!matchedVaultFile) {
			console.error(`Could not find file in vault by file path: \"${path}\".`);
		}
		return matchedVaultFile?.path;
	}
}
