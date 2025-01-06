import ExoAction from "../ExoAction";
import ExoContext from "../../../../../../../common/ExoContext";

export default class FindDuplicateIds implements ExoAction {
	name = "Find Duplicate IDs";
	slug = "find-duplicate-ids";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		this.ctx.kObjectUtility.findNotesWithDuplicateIds();
	}
}
