import {FuzzySuggestModal} from "obsidian";
import ExoContext from "../../../../../common/ExoContext";
import {ModalItem} from "./ModalItem";
import ModalItemClickedHandler from "./ModalItemClickedHandler";

export class ExoModal extends FuzzySuggestModal<ModalItem> {

	constructor(private ctx: ExoContext,
				private items: ModalItem[]) {
		super(ctx.app);
	}

	getItems(): ModalItem[] {
		return this.items;
	}

	getItemText(item: ModalItem): string {
		return item.name;
	}

	async onChooseItem(item: ModalItem) {
		const modalItemHandler = new ModalItemClickedHandler(this.ctx);

		await this.ctx.userFriendlyWithFileLog.callAsync(async () => {
			await item.visit(modalItemHandler);
		});
	}
}
