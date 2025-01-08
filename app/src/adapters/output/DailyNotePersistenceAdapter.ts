import DailyNote from "../../../../core/src/domain/tms/DailyNote";
import DailyNoteRepository from "../../../../core/src/ports/output/DailyNoteRepository";
import ExoContext from "../../../../common/ExoContext";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";

export default class DailyNotePersistenceAdapter extends AbstractPersistenceAdapter<DailyNote> implements DailyNoteRepository {
	constructor(ctx: ExoContext) {
		super(ctx, DailyNote.CLASS);
	}

	async findCurrent(): Promise<DailyNote | null> {
		const currentDailyNotes = await this.find(dn => dn.date.toDateString() === new Date().toDateString());
		return currentDailyNotes.length > 0 ? currentDailyNotes[0] : null;
	}
}
