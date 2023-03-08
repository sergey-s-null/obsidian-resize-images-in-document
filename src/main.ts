import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { createContainer } from "./di/createContainer";
import { SettingsProvider } from "./services/SettingsProvider";
import { TYPES } from "./di/TYPES";
import { AskForResizeImagesInFileModal } from "./modals/AskForResizeImagesInFileModal";
import { PluginSettingsTab } from "./settings_tabs/PluginSettingsTab";

export default class MyPlugin extends Plugin {
	private settingsProvider: SettingsProvider;

	async onload() {
		const container = createContainer(this);
		this.settingsProvider = container.get<SettingsProvider>(TYPES.SettingsProvider);

		this.addRibbonIcon('dice', 'Sample Plugin', async () => {
			const filePath = this.app.workspace.activeEditor?.file?.path;
			if (!filePath) {
				new Notice("Error: Could not get path of current file.");
				return;
			}

			const fileContent = this.app.workspace.activeEditor?.editor?.getDoc()?.getValue();
			if (!fileContent) {
				new Notice("Current document is empty.");
				return;
			}

			const settings = await this.settingsProvider.getSettings();

			new AskForResizeImagesInFileModal(
				this.app,
				{
					filePath: filePath,
					defaultImageTargetWidth: settings.imageTargetWidth
				},
				async values => {
					settings.imageTargetWidth = values.imageTargetWidth.toString();
					await this.settingsProvider.saveSettings();

					this.resizeAttachedImages(fileContent);
				})
				.open();
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new Notice("Simple command");
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new Notice(`Selection: ${editor.getSelection()}`);
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		this.addSettingTab(new PluginSettingsTab(this.app, this, this.settingsProvider));
	}

	onunload() {

	}

	private resizeAttachedImages(fileContent: string) {
		throw new Error("Not implemented");// todo
	}

	private extractAttachmentsPaths(fileContent: string): string[] {
		const attachmentRegex = /!\[\[([^\[\]]*)]]/g;
		return [...fileContent.matchAll(attachmentRegex)].map(x => x[1]);
	}
}
