import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";
import AbstractLayout, {EffortFieldEnum} from "./AbstractLayout";
import DailyNote from "../../../../../../core/src/domain/tms/DailyNote";
import {Predicate} from "../../../../../../common/fp/Predicate";
import DateUtils from "../../../../../../common/utils/DateUtils";

export default class DailyNoteLayout extends AbstractLayout<DailyNote> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: DailyNote, el: HTMLElement): Promise<void> {
		const filters: Map<string, (e: Effort) => boolean> = new Map();
		const day = ko.date;
		const dayStart = new Date(day);
		dayStart.setHours(0, 0, 0, 0);

		filters.set("e2e done", e => {
			if (!e.ended || !e.started) {
				return false;
			}
			return DateUtils.sameDay(e.started, day) && DateUtils.sameDay(e.ended, day);
		});

		filters.set("plannedStartToday", e => {
			if (filters.get("e2e done")!(e)) {
				return false;
			}
			if (!e.plannedStart) {
				return false;
			}
			return DateUtils.sameDay(e.plannedStart, day);
		});

		filters.set("plannedStartBefore", e => {
			if (!e.plannedStart || e.isResolved()) {
				return false;
			}
			return DateUtils.dayBefore(e.plannedStart, day);
		});

		filters.set("due", e => {
			if (!e.due || e.isResolved()) {
				return false;
			}
			return DateUtils.sameDayOrBefore(e.due, day);
		});

		filters.set("started", e => {
			if (filters.get("e2e done")!(e)) {
				return false;
			}
			if (!e.started || e.isResolved()) {
				return false;
			}
			return DateUtils.sameDay(e.started, day);
		});

		filters.set("ended", e => {
			if (filters.get("e2e done")!(e)) {
				return false;
			}
			if (!e.ended) {
				return false;
			}
			return DateUtils.sameDay(e.ended, day);
		});

		const efforts = await this.ctx.effortRepository.find(e => {
			return Array.from(filters.values()).some(f => f(e));
		});

		await this.handlePlannedStartToday(efforts, el, filters);
		await this.printEfforts(efforts, el, filters.get("plannedStartBefore")!, "Planned start before");
		await this.printEfforts(efforts, el, filters.get("due")!, "Due today or before");
		await this.printEfforts(efforts, el, filters.get("started")!, "Started today");
		await this.printEfforts(efforts, el, filters.get("ended")!, "Ended today");
		await this.handleDoneEfforts(efforts, el, filters);
		// TODO do not show waiting efforts that waiting-till > dn-date
	}

	private async handlePlannedStartToday(efforts: Effort[], el: HTMLElement, filters: Map<string, (e: Effort) => boolean>) {
		let fieldsToRender: EffortFieldEnum[] = [EffortFieldEnum.PLAN_TIME];
		await this.printEfforts(efforts, el, filters.get("plannedStartToday")!, "Planned start today", fieldsToRender, [EffortFieldEnum.PLAN_TIME]);
	}

	private async handleDoneEfforts(efforts: Effort[], el: HTMLElement, filters: Map<string, (e: Effort) => boolean>) {
		let fieldsToRender: EffortFieldEnum[] = [EffortFieldEnum.STARTED, EffortFieldEnum.TIME_SPENT];
		await this.printEfforts(efforts, el, filters.get("e2e done")!, "Done today", fieldsToRender, [EffortFieldEnum.STARTED]);
	}

	private async printEfforts(allEfforts: Effort[],
							   el: HTMLElement,
							   predicate: Predicate<Effort>,
							   title: string,
							   fieldsToRender = [EffortFieldEnum.AREA, EffortFieldEnum.STATUS],
							   fieldsToSort?: EffortFieldEnum[]) {
		const efforts = allEfforts.filter(predicate);
		if (efforts.length > 0) {
			let header = this.createH1(title);
			el.appendChild(header);

			const dvTable = await this.createTableSuper(efforts, fieldsToRender, fieldsToSort);
			el.appendChild(dvTable)
		}
	}
}
