import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class CountNotesWithoutId extends AbstractExoAction {
	name = "Count Notes Without Id";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		await this.ctx.kObjectUtility.addMissingId();
	}
}
