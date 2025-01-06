import ModalItemsFolder from "./ModalItemsFolder";
import ExoAction from "../../../adapters/input/actions/ExoAction";
import {ModalItemVisitor} from "./ModalItem";
import ExoContext from "../../../../../common/ExoContext";
import {ExoModal} from "./ExoModal";

export default class ModalItemClickedHandler implements ModalItemVisitor {
	constructor(private ctx: ExoContext) {
	}

	async visitFolder(folder: ModalItemsFolder): Promise<void> {
		new ExoModal(this.ctx, folder.items).open();
	}

	async visitAction(action: ExoAction): Promise<void> {
		await action.execute(this.ctx);
	}
}
