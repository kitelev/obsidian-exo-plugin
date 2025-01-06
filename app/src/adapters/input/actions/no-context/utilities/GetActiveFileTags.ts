import {Notice} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class GetActiveFileTags extends AbstractExoAction {
	name = "Get Active File Tags";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const tags = this.ctx.appUtils.getTagsFromFile(activeFile);
		new Notice(`The current opened note has tags: ${tags.join(", ")}`);
	}
}
