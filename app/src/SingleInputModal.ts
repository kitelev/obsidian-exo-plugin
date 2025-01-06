import {Modal, Notice} from "obsidian";
import ExoContext from "../../common/ExoContext";

export default class SingleInputModal extends Modal {
	private input: HTMLInputElement;

	constructor(ctx: ExoContext,
				private callback: (input: string) => Promise<void>) {
		super(ctx.app);
	}

	onOpen() {
		this.setTitle("Enter note title");

		this.input = this.contentEl.createEl("input", {
			type: "text",
			placeholder: "Note title",
			attr: {
				style: "width: 100%"
			}
		});

		this.input.addEventListener("keydown", async (event) => {
			if (event.key === "Enter") {
				await this.submitInput();
			}
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	private async submitInput() {
		const inputValue = this.input.value.trim();
		if (inputValue) {
			try {
				await this.callback(inputValue);
				this.close();
			} catch (e) {
				console.error(e);
				new Notice(`Error: ${e.message}`);
			}
		}
	}
}
