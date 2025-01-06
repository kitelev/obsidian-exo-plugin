import {Notice} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class GetCurrentKOC extends AbstractExoAction {
	name = "Get Current KOC";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		const file = this.ctx.appUtils.getActiveFileOrThrow();
		const currentKO = this.ctx.kObjectCreator.createFromTFile(file);
		new Notice(`The current object's KOC is ${currentKO.koc}`);
	}
}
