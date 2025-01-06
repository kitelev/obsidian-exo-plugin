import {Modal} from "obsidian";
import ExoContext from "../../common/ExoContext";
import {ConsumerAsync} from "../../common/fp/Consumer";
import UserFriendly from "./utils/UserFriendly";

export default class SingleInputModal extends Modal {
	private input: HTMLInputElement;

	constructor(ctx: ExoContext,
				private callback: ConsumerAsync<string>) {
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
				await UserFriendly.callAsync(async () => {
					await this.submitInput();
				});
			}
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	private async submitInput() {
		const inputValue = this.input.value.trim();
		if (!inputValue) {
			throw new Error("Note title cannot be empty");
		}

		await this.callback(inputValue);
		this.close();
	}
}
