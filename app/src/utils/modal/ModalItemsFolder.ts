import {ModalItem, ModalItemVisitor} from "./ModalItem";
import ExoContext from "../../../../common/ExoContext";
import OpenCurrentDailyNote from "../../adapters/input/actions/no-context/domain/OpenCurrentDailyNote";
import CreateEmptyNoteWithinInbox from "../../adapters/input/actions/no-context/domain/CreateEmptyNoteWithinInbox";

export default class ModalItemsFolder implements ModalItem {

	constructor(public name: string,
				public items: ModalItem[],
				public ctx: ExoContext) {
	}

	static all(ctx: ExoContext): ModalItem[] {
		return [
			new OpenCurrentDailyNote(ctx),
			new CreateEmptyNoteWithinInbox(ctx)
		];
	}

	async visit(visitor: ModalItemVisitor): Promise<void> {
		await visitor.visitFolder(this);
	}
}

export class ModalItemsFolderFactory {
	constructor(private ctx: ExoContext) {
	}

	create(name: string, items: ModalItem[]): ModalItemsFolder {
		return new ModalItemsFolder(name, items, this.ctx);
	}
}
