import ExoCommand from "../ExoCommand";
import {Notice} from "obsidian";
import ExoContext from "../../../../../../common/ExoContext";

export default class CountNotesExoCommand implements ExoCommand {
	name = "Notes Count";
	slug = "count-notes";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		const result = this.ctx.appUtils.getAllNotes().length;
		new Notice(`Vault has ${result} notes`);
	}
}
