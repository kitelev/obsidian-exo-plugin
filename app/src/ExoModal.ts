import {FuzzySuggestModal, Notice} from "obsidian";
import ExoAction from "./adapters/input/actions/modal/ExoAction";
import ExoActions from "./adapters/input/actions/modal/ExoActions";
import ExoContext from "../../common/ExoContext";

export class ExoModal extends FuzzySuggestModal<ExoAction> {

	constructor(private ctx: ExoContext) {
		super(ctx.app);
	}

	getItems(): ExoAction[] {
		return ExoActions.all(this.ctx);
	}

	getItemText(cmd: ExoAction): string {
		return cmd.name;
	}

	async onChooseItem(cmd: ExoAction) {
		try {
			await cmd.execute(this.ctx);
		} catch (e) {
			console.error(e);
			new Notice(`Error: ${e.message}`);
		}
	}
}
