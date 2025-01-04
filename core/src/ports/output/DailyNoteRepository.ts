import DailyNote from "../../domain/tms/DailyNote";

export default interface DailyNoteRepository {
	findCurrent(): Promise<DailyNote | null>;

	findAll(): Promise<DailyNote[]>;
}
