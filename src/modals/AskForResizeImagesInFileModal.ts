import { App, Modal, Notice, Setting } from "obsidian";


interface ModalInputValues {
	filePath: string;
	defaultImageTargetWidth: string;
}


interface ModalOutputValues {
	imageTargetWidth: number;
}


export class AskForResizeImagesInFileModal extends Modal {
	private readonly values: ModalInputValues;
	private readonly onSubmit: (values: ModalOutputValues) => void;

	private imageTargetWidth: string;

	public constructor(
		app: App,
		inputValues: ModalInputValues,
		onSubmit: (values: ModalOutputValues) => void
	) {
		super(app);

		this.values = inputValues;
		this.onSubmit = onSubmit;

		this.imageTargetWidth = this.values.defaultImageTargetWidth;
	}

	async onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h3", { text: "Resize all images in current document?" });
		contentEl.createSpan({ text: "Current document path: " });
		contentEl.createSpan({
			text: `${this.values.filePath}`,
			cls: "bold-text"
		});

		new Setting(contentEl)
			.setName("Image target width:")
			.addText(t => t
				.setValue(this.imageTargetWidth)
				.setPlaceholder("Enter width")
				.onChange(value => this.imageTargetWidth = value)
			);

		new Setting(contentEl)
			.addButton(b => b
				.setButtonText("Submit")
				.setCta()
				.onClick(async () => await this.submit())
			)
			.addButton(b => b
				.setButtonText("Cancel")
				.onClick(() => this.close())
			);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	private async submit() {
		const width = Number(this.imageTargetWidth);
		if (isNaN(width) || !isFinite(width) || width <= 0) {
			new Notice("Invalid image target width.");
			return;
		}

		this.close();
		this.onSubmit({
			imageTargetWidth: width
		});
	}
}
