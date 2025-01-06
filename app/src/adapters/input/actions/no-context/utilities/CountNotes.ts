import {Notice} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class CountNotes extends AbstractExoAction {
	name = "Notes Count";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		const result = this.ctx.appUtils.getAllNotes().length;
		new Notice(`Vault has ${result} notes`);
	}
}
