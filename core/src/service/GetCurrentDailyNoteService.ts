import GetCurrentDailyNoteUseCase from "../ports/input/GetCurrentDailyNoteUseCase";
import DailyNote from "../domain/tms/DailyNote";
import DailyNoteRepository from "../ports/output/DailyNoteRepository";

export default class GetCurrentDailyNoteService implements GetCurrentDailyNoteUseCase {

	constructor(private repository: DailyNoteRepository) {
	}

	async get(): Promise<DailyNote | null> {
		return this.repository.findCurrent();
	}
}
