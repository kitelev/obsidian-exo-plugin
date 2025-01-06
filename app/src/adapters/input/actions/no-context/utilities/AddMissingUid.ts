import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class AddMissingUid extends AbstractExoAction {
	name = "Add Missing UID";

	constructor(private ctx: ExoContext) {
		super();
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
