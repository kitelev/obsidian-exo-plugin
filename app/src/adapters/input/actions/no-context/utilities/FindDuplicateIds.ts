import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class FindDuplicateIds extends AbstractExoAction {
	name = "Find Duplicate IDs";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		this.ctx.kObjectUtility.findNotesWithDuplicateIds();
	}
}
