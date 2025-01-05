import ExoCommand from "../ExoCommand";
import ExoContext from "../../../../../../common/ExoContext";

export default class FindDuplicateIds implements ExoCommand {
	name = "Find Duplicate IDs";
	slug = "find-duplicate-ids";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		this.ctx.kObjectUtility.findNotesWithDuplicateIds();
	}
}
