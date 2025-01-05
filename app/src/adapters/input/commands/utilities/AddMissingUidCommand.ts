import ExoCommand from "../ExoCommand";
import ExoContext from "../../../../../../common/ExoContext";

export default class AddMissingUidCommand implements ExoCommand {
	name = "Add Missing UID";
	slug = "add-missing-uid";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		let kocObjects = this.ctx.appUtils.getAllNotes().filter(n => n.path.startsWith("9 Meta/0 Domain/"));

		console.debug(`Found ${kocObjects.length} KOC objects.`);
		for (const kocObject of kocObjects) {
			await this.ctx.kObjectUtility.setRandomId(kocObject);
			console.debug(`Added missing UID to ${kocObject.path}`);
		}
		console.debug("Finished adding missing UIDs to KOC objects.");
	}
}
