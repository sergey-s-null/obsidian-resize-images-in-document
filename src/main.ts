import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { createContainer } from "./di/createContainer";
import { SettingsProvider } from "./services/SettingsProvider";
import { TYPES } from "./di/TYPES";
import { AskForResizeImagesInFileModal } from "./modals/AskForResizeImagesInFileModal";

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
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
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
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this, this.settingsProvider));
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	private readonly settingsProvider: SettingsProvider;

	constructor(app: App, plugin: Plugin, settingsProvider: SettingsProvider) {
		super(app, plugin);

		this.settingsProvider = settingsProvider;
	}

	async display(): Promise<void> {
		const { containerEl } = this;

		const settings = await this.settingsProvider.getSettings();

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName("Image target width")
			.setDesc("Width to which images should be resized")
			.addText(text => text
				.setPlaceholder('Enter width')
				.setValue(settings.imageTargetWidth)
				.onChange(async (value) => {
					settings.imageTargetWidth = value;
					await this.settingsProvider.saveSettings();
				}));
	}
}
