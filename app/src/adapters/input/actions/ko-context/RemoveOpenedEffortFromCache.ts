import AbstractExoAction from "../AbstractExoAction";
import ExoContext from "../../../../../../common/ExoContext";
import {Notice} from "obsidian";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";

export default class RemoveOpenedEffortFromCache extends AbstractExoAction {
	name = "Remove opened effort from cache";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const ko = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);

		if (ko instanceof Effort) {
			this.ctx.effortCache.remove(ko);
		}
		new Notice(`Dropped ${ko.title} from cache`);
	}
}
