import DailyNote from "../../../../core/src/domain/tms/DailyNote";
import {TFile} from "obsidian";
import DailyNoteCreator from "../../utils/creators/DailyNoteCreator";
import AppUtils from "../../utils/AppUtils";
import DailyNoteRepository from "../../../../core/src/ports/output/DailyNoteRepository";
import ExoContext from "../../../../common/ExoContext";

export default class DailyNotePersistenceAdapter implements DailyNoteRepository {
	private appUtils: AppUtils = this.ctx.appUtils;
	private dailyNoteCreator: DailyNoteCreator = this.ctx.dailyNoteCreator;

	constructor(private ctx: ExoContext) {
	}

	async findCurrent(): Promise<DailyNote | null> {
		const allDNs = await this.findAll();
		let currentDailyNotes = allDNs.filter(dn => dn.date.toDateString() === new Date().toDateString());
		return currentDailyNotes.length > 0 ? currentDailyNotes[0] : null;
	}

	async findAll(): Promise<DailyNote[]> {
		const rawDailyNotes: TFile[] = this.appUtils.findNotes((f: TFile) => {
			return this.appUtils.getTagsFromFile(f).includes("TMS/DailyNote");
		});

		return Promise.all(rawDailyNotes.map(async f => await this.dailyNoteCreator.create(f)));
	}
}
