import AbstractExoAction from "../AbstractExoAction";
import ExoContext from "../../../../../../common/ExoContext";
import {Notice} from "obsidian";

export default class MoveToSuitableFolderAction extends AbstractExoAction {
	name = "Move to suitable folder";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const ko = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);

		const suitableFolder = this.ctx.koPathRulesHelper.getFolderPath(ko);
		await this.ctx.appUtils.createFolderIfNotExists(suitableFolder);

		await this.ctx.appUtils.move(ko, suitableFolder);
		new Notice(`Moved to ${suitableFolder}`);
	}
}
