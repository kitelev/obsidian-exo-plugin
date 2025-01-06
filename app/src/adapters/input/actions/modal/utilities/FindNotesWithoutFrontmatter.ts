import ExoAction from "../ExoAction";
import {Notice} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";

export default class FindNotesWithoutFrontmatter implements ExoAction {
	name = "Find Notes Without Frontmatter";
	slug = "find-notes-without-frontmatter";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		const result = this.ctx.kObjectUtility.findNotesWithoutFrontmatter();
		new Notice(`Vault has ${result.length} notes without frontmatter.`);
	}
}
