import ExoCommand from "../ExoCommand";
import ExoContext from "../../../../../../common/ExoContext";

export default class CountNotesWithoutId implements ExoCommand {
	name = "Count Notes Without Id";
	slug = "count-notes-without-id";

	constructor(private ctx: ExoContext) {
	}

	async execute(): Promise<void> {
		await this.ctx.kObjectUtility.addMissingId();
	}
}
