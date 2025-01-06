import {Modal} from "obsidian";
import ExoContext from "../../../../../common/ExoContext";
import {BiConsumerAsync} from "../../../../../common/fp/Consumer";
import UserFriendly from "../../UserFriendly";
import {KOC} from "../../../../../core/src/domain/KOC";

export default class InputAndSelectKOCModal extends Modal {
	private input: HTMLInputElement;
	private select: HTMLSelectElement;

	constructor(ctx: ExoContext,
				private callback: BiConsumerAsync<string, string>) {
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

		this.select = this.contentEl.createEl(
			"select", {
				attr: {
					style: "width: 100%; margin-top: 10px;"
				}
			});
		Object.values(KOC).forEach((value) => {
			const option = this.select.createEl("option", {value});
			option.textContent = value;
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

		const selectValue = this.select.value;

		await this.callback(inputValue, selectValue);
		this.close();
	}
}
