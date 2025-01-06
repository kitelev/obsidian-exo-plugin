import {Modal} from "obsidian";
import ExoContext from "../../../../../common/ExoContext";
import {ConsumerAsync} from "../../../../../common/fp/Consumer";
import UserFriendly from "../../UserFriendly";

export default class ModalForm extends Modal {
	constructor(ctx: ExoContext,
				private title: string,
				private fields: FormField<any>[],
				private callback: ConsumerAsync<string[]>) {
		super(ctx.app);
	}

	onOpen() {
		this.setTitle(this.title);

		this.fields.forEach((field) => {
			field.render(this.contentEl);
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
		const values = this.fields.map((field) => field.getValue());
		await this.callback(values);
		this.close();
	}
}

export interface FormField<T> {
	render(contentEl: HTMLElement): void;

	getValue(): T;
}

export abstract class AbstractFormField<T> implements FormField<T> {
	protected constructor(protected fieldName: string) {
	}

	render(contentEl: HTMLElement): void {
		const div = contentEl.createEl("div");
		div.createEl("label", {
			text: this.fieldName,
			attr: {
				style: "margin-top: 10px; display: block;"
			}
		});

		this.renderInternal(div);
	}

	abstract getValue(): T;

	protected abstract renderInternal(div: HTMLDivElement): void;
}

export class TextField extends AbstractFormField<string> {
	private input: HTMLInputElement;

	constructor(fieldName: string,
				private prefilledValue?: string) {
		super(fieldName);
	}

	renderInternal(fieldRow: HTMLElement): void {
		this.input = fieldRow.createEl("input", {
			type: "text",
			placeholder: this.fieldName,
			attr: {
				style: "width: 100%"
			},
			value: this.prefilledValue
		});
	}

	getValue(): string {
		return this.input.value;
	}
}

export class SelectField extends AbstractFormField<string> {
	private select: HTMLSelectElement;

	constructor(protected fieldName: string,
				private options: SelectOption[]) {
		super(fieldName);
	}

	renderInternal(fieldRow: HTMLElement): void {
		this.select = fieldRow.createEl(
			"select", {
				attr: {
					style: "width: 100%; margin-top: 10px;"
				}
			});

		this.options.forEach((selectOption) => {
			const option = this.select.createEl("option", {value: selectOption.value});
			option.textContent = selectOption.display;
		});
	}

	getValue(): string {
		return this.select.value as string;
	}
}

export class SelectOption {
	constructor(public value: string | undefined,
				public display: string) {
	}
}
