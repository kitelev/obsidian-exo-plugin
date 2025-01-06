import {Modal} from "obsidian";
import ExoContext from "../../../../common/ExoContext";
import {ConsumerAsync} from "../../../../common/fp/Consumer";
import UserFriendly from "../UserFriendly";

export default class InputModal extends Modal {
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

		const submitButton = this.contentEl.createEl(
			"button", {
				text: "Submit",
				attr: {
					style: "margin-top: 10px; margin-left: auto; margin-right: auto; display: block;"
				}
			});
		submitButton.addEventListener("click", async () => {
			await UserFriendly.callAsync(async () => {
				await this.submit();
			});
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	private async submit() {
		const inputValue = this.input.value.trim();
		if (!inputValue) {
			throw new Error("Note title cannot be empty");
		}

		await this.callback(inputValue);
		this.close();
	}
}
