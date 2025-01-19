import AbstractExoAction from "../AbstractExoAction";
import ExoContext from "../../../../../../common/ExoContext";
import {Notice} from "obsidian";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";

export default class MoveToSuitableFolderAction extends AbstractExoAction {
	name = "Move to suitable folder";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		let activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		let ko = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);

		if (!(ko instanceof Effort)) {
			throw new Error("Only Effort can be moved to suitable folder");
		}

		const suitableFolder = this.ctx.koPathRulesHelper.getFolderPath(ko);
		if (!await this.ctx.app.vault.adapter.exists(suitableFolder)) {
			await this.ctx.app.vault.createFolder(suitableFolder);
		}

		await this.ctx.appUtils.move(ko, suitableFolder);
		new Notice(`Moved to ${suitableFolder}`);
	}

}
