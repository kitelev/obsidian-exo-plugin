import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class AddMissingFrontmatter extends AbstractExoAction {
	name = "Add Missing Frontmatter";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		const notesWithoutFrontmatter = this.ctx.kObjectUtility.findNotesWithoutFrontmatter();
		console.debug(`Found ${notesWithoutFrontmatter.length} notes without frontmatter.`);

		console.debug("Adding frontmatter to notes without frontmatter...");
		let idx = 0;
		for (let tFile of notesWithoutFrontmatter) {
			await this.ctx.kObjectUtility.addFrontmatterToFile(tFile);
			console.debug(`Added frontmatter to ${tFile.path}`);
			idx++;
			if (idx % 10 === 0) {
				console.debug(`Processed ${idx} files.`);
			}
		}
		console.debug("Finished adding frontmatter to notes without frontmatter.");
	}
}
