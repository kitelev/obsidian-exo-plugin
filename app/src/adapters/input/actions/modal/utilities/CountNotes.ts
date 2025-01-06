import ExoAction from "../ExoAction";
import {Notice} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";

export default class CountNotes implements ExoAction {
	name = "Notes Count";
	slug = "count-notes";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		const result = this.ctx.appUtils.getAllNotes().length;
		new Notice(`Vault has ${result} notes`);
	}
}
