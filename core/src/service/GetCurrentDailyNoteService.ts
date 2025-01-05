import GetCurrentDailyNoteUseCase from "../ports/input/GetCurrentDailyNoteUseCase";
import DailyNote from "../domain/tms/DailyNote";
import ExoContext from "../../../common/ExoContext";

export default class GetCurrentDailyNoteService implements GetCurrentDailyNoteUseCase {

	constructor(private ctx: ExoContext) {
	}

	async get(): Promise<DailyNote | null> {
		return this.ctx.dailyNoteRepository.findCurrent();
	}
}
