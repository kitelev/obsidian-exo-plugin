import {Notice} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class FindNotesWithoutFrontmatter extends AbstractExoAction {
	name = "Find Notes Without Frontmatter";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		const result = this.ctx.kObjectUtility.findNotesWithoutFrontmatter();
		new Notice(`Vault has ${result.length} notes without frontmatter.`);
	}
}
