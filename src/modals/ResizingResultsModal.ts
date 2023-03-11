import { App, Modal, Setting } from "obsidian";
import { ImagesBatchResizeResult } from "../entities/ImagesBatchResizeResult";


interface ModalInputValues {
	result: ImagesBatchResizeResult;
}


export class ResizingResultsModal extends Modal {
	private readonly values: ModalInputValues;

	public constructor(
		app: App,
		values: ModalInputValues
	) {
		super(app);

		this.values = values;
	}

	onOpen() {
		const { contentEl } = this;
		const { results } = this.values.result;

		contentEl.createEl("h3", { text: "Resize result" });

		const succeededCount = results.filter(x => !x.error).length;
		contentEl.createDiv({ text: `Succeeded: ${succeededCount} files of ${results.length}.` });

		const resultsWithError = results.filter(x => x.error);
		if (resultsWithError.length > 0) {
			const failedText = resultsWithError
				.map(x => `${x.imagePath}: ${x.error!.message}`)
				.join("\n");
			contentEl.createDiv({ text: "Failed:", cls: "mt-3" });
			contentEl.createDiv({ text: failedText, cls: ["errors-list", "mb-3"] });
		}

		new Setting(contentEl)
			.addButton(b => b
				.setButtonText("Ok")
				.setCta()
				.onClick(() => this.close())
			);
	}
}
