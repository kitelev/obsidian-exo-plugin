import DailyNote from "../../domain/tms/DailyNote";
import GenericRepository from "./GenericRepository";

export default interface DailyNoteRepository extends GenericRepository<DailyNote> {
	findCurrent(): Promise<DailyNote | null>;
}
