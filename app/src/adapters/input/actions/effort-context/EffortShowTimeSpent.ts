import AbstractExoAction from "../AbstractExoAction";
import ExoContext from "../../../../../../common/ExoContext";
import {Notice} from "obsidian";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";
import EffortQuery from "../../../../../../core/src/domain/ems/effort/EffortQuery";

export default class EffortShowTimeSpent extends AbstractExoAction {
	name = "Print effort time spent";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const ko = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);

		if (!(ko instanceof Effort)) {
			await this.ctx.loggingFacade.logError(new Error("This action available only for Effort"));
		}

		const res = EffortQuery.TIME_SPENT.executeFunction(ko as Effort);
		new Notice(`Time spent: ${res}`);
	}
}
