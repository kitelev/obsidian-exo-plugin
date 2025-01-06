import ExoAction from "../ExoAction";
import {Notice} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";

export default class GetActiveFileTags implements ExoAction {
	name = "Get Active File Tags";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const tags = this.ctx.appUtils.getTagsFromFile(activeFile);
		new Notice(`The current opened note has tags: ${tags.join(", ")}`);
	}
}
