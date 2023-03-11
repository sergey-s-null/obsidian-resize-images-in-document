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

		const succeededCount = results.filter(x => x.result == "ok").length;
		contentEl.createDiv({ text: `Succeeded resized: ${succeededCount} of ${results.length}.` });

		const skippedCount = results.filter(x => x.result == "skipped").length;
		contentEl.createDiv({ text: `Skipped: ${skippedCount} of ${results.length}.` });

		const failedResults = results.filter(x => x.result instanceof Error);
		if (failedResults.length > 0) {
			const failedText = failedResults
				.map(x => `${x.imagePath}: ${(x.result as Error).message}`)
				.join("\n");
			contentEl.createDiv({
				text: `Failed (${failedResults.length} of ${results.length}):`,
				cls: "mt-3"
			});
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
