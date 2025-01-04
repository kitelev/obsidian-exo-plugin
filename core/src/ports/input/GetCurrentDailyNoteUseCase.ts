import DailyNote from "../../domain/tms/DailyNote";

export default interface GetCurrentDailyNoteUseCase {
	get(): Promise<DailyNote | null>;
}
