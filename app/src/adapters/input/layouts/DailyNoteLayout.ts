import ExoContext from "../../../../../common/ExoContext";
import DvRenderer from "../../../utils/dv/DvRenderer";
import Effort from "../../../../../core/src/domain/effort/Effort";
import {EffortStatusComparator} from "../../../../../core/src/domain/effort/EffortStatus";
import Comparator from "../../../../../common/Comparator";
import AbstractLayout from "./AbstractLayout";
import DailyNote from "../../../../../core/src/domain/DailyNote";

export default class DailyNoteLayout extends AbstractLayout<DailyNote> {
	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: DailyNote, el: HTMLElement): Promise<void> {
		await this.plannedStartToday(el);
		await this.plannedStartBefore(el);
		await this.due(el);

		// Efforts with started = today
		// Efforts with ended = today
	}

	private async plannedStartToday(el: HTMLElement) {
		const today = new Date();
		const efforts = await this.ctx.effortRepository.find(e => {
			if (e.plannedStart === null) {
				return false;
			}
			return e.plannedStart.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
		});
		if (efforts.length > 0) {
			let header = this.createH1("Planned start today");
			el.appendChild(header);

			const dvTable = await this.createTable(efforts);
			el.appendChild(dvTable)
		}
	}

	private async plannedStartBefore(el: HTMLElement) {
		const today = new Date();
		const efforts = await this.ctx.effortRepository.find(e => {
			if (e.plannedStart === null || e.isResolved()) {
				return false;
			}
			return e.plannedStart.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
		});
		if (efforts.length > 0) {
			let header = this.createH1("Planned start before");
			el.appendChild(header);

			const dvTable = await this.createTable(efforts);
			el.appendChild(dvTable)
		}
	}

	private async due(el: HTMLElement) {
		const today = new Date();
		const todayEfforts = await this.ctx.effortRepository.find(e => {
			if (e.due === null || e.isResolved()) {
				return false;
			}
			return e.due.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0);
		});
		if (todayEfforts.length > 0) {
			let header = this.createH1("Due today or before");
			el.appendChild(header);

			let sorted = todayEfforts.sort(Comparator.comparing((e: Effort) => e.due!.getTime()));
			const dvTable = await this.createTable(sorted);
			el.appendChild(dvTable)
		}
	}

	private async createTable(efforts: Effort[]) {
		const headers = ["Effort", "Area", "Status", "Votes"];

		const rowsComparator = Comparator.combineCompare(
			EffortStatusComparator.compare,
			Comparator.reverse(Comparator.comparing((e: Effort) => e.getVotes())));

		const rows = efforts
			.sort(rowsComparator)
			.map(e => {
				const effortLink = this.toLink(e);
				const aresStr = e.area?.name ?? "--"; // TODO use inherited area
				const statusStr = e.status;
				const votesStr = e.getVotes();
				return [effortLink, aresStr, statusStr, votesStr];
			});
		return await this.dvRenderer.table(headers, rows);
	}
}
