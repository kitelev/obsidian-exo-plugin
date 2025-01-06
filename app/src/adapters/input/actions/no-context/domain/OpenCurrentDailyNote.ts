import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class OpenCurrentDailyNote extends AbstractExoAction {
	name = "Open Current Daily Note";

	constructor(private ctx: ExoContext) {
		super()
	}

	async execute() {
		const currentDN = await this.ctx.getCurrentDailyNoteUseCase.get();
		if (!currentDN) {
			throw new Error("No current daily note found");
		}

		await this.ctx.appUtils.openKObject(currentDN);
	}
}
