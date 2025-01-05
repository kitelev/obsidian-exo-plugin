import ExoCommand from "../ExoCommand";
import ExoContext from "../../../../../../common/ExoContext";

export default class AddMissingFrontmatter implements ExoCommand {
	name = "Add Missing Frontmatter";
	slug = "add-missing-frontmatter";

	constructor(private ctx: ExoContext) {
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
