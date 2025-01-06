import ExoAction from "../ExoAction";
import ExoContext from "../../../../../../../common/ExoContext";

export default class OpenCurrentDailyNoteExoCommand implements ExoAction {
	name = "Open Current Daily Note";
	slug = "open-current-daily-note";

	constructor(private ctx: ExoContext) {
	}

	async execute() {
		const currentDN = await this.ctx.getCurrentDailyNoteUseCase.get();
		if (!currentDN) {
			throw new Error("No current daily note found");
		}

		await this.ctx.appUtils.openKObject(currentDN);
	}
}
