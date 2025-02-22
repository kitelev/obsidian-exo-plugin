import KObject from "../../KObject";
import {EffortStatus} from "./EffortStatus";
import {KOC} from "../../KOC";
import Area from "../Area";
import {UUID} from "node:crypto";
import EffortPrototype from "./EffortPrototype";
import DateUtils from "../../../../../common/utils/DateUtils";
import EffortAction from "./EffortAction";

// TODO add validation - effort cannot have both prototype and (parent or area)
export default class Effort extends KObject {
	static readonly CLASS = KOC.EMS_EFFORT;

	constructor(id: UUID,
				title: string,
				public prototype: EffortPrototype | null,
				public parent: Effort | null,
				public area: Area | null,
				public prerequisite: Effort | null,
				public relates: KObject[] = [],
				public status: EffortStatus,
				public votes: number | null,
				public appetite: string | null,
				public due: Date | null,
				public plannedStart: Date | null,
				public plannedEnd: Date | null,
				public started: Date | null,
				public ended: Date | null,
				public holdsHistory: string | null,
				public unknownProps: Record<string, any> = {},
				body: string) {
		super(id, Effort.CLASS, title, body);
	}

	// TODO delete
	start() {
		this.startWithDate(new Date());
	}

	// TODO rename to start()
	startWithDate(startedDate: Date) {
		EffortAction.START.assertFunction(this);

		this.started = startedDate;
		this.status = EffortStatus.STARTED;
	}

	hold(holdDate: Date) {
		EffortAction.HOLD.assertFunction(this);

		const nowStr = DateUtils.formatTimestamp(holdDate);

		this.status = EffortStatus.HOLD;
		if (!this.holdsHistory) {
			this.holdsHistory = nowStr;
		} else {
			this.holdsHistory = `${this.holdsHistory}, ${nowStr}`;
		}
	}

	resume(resumeDate: Date) {
		EffortAction.RESUME.assertFunction(this);

		const nowStr = DateUtils.formatTimestamp(resumeDate);

		this.status = EffortStatus.STARTED;
		this.holdsHistory = `${this.holdsHistory} - ${nowStr}`;
	}

	end() {
		EffortAction.COMPLETE.assertFunction(this);

		this.ended = new Date();
		this.status = EffortStatus.ENDED;
	}

	getRelatedArea(): Area | null {
		if (this.area !== null) return this.area;
		if (this.prototype !== null) return this.prototype.area;
		if (this.parent !== null) return this.parent.getRelatedArea();
		return null;
	}

	getClosestParent(): Effort | null {
		if (this.parent !== null) return this.parent;
		if (this.prototype !== null) return this.prototype.effortParent;
		return null;
	}

	/**
	 * Returns true if this effort is in the given area or one of its parents
	 */
	isInAreaOrOneOfItsParents(area: Area): boolean {
		if (!this.getRelatedArea() || this.getRelatedArea() == null) return false;
		if (this.getRelatedArea()!.id === area.id) return true;
		return this.getRelatedArea()!.isChildOf(area);
	}

	getVotes(): number {
		return this.votes ?? 0;
	}

	isResolved(): boolean {
		return this.status === EffortStatus.ENDED || this.status === EffortStatus.TRASHED;
	}

	isUnresolved(): boolean {
		return !this.isResolved();
	}

	getLeadTimeMinutes(): number | null {
		if (!this.started || !this.ended) {
			return null;
		}
		return (this.ended.getTime() - this.started.getTime()) / 1000 / 60;
	}
}

export class EffortBuilder {
	public id: UUID;
	public title: string;
	public body: string = "";
	public prototype?: EffortPrototype | null;
	public parent?: Effort | null;
	public area?: Area | null;
	public prerequisite?: Effort | null;
	public relates: KObject[] = [];
	public status: EffortStatus = EffortStatus.DRAFT;
	public votes?: number;
	public appetite?: string;
	public due?: Date | null;
	public plannedStart?: Date | null;
	public plannedEnd?: Date | null;
	public started?: Date | null;
	public ended?: Date | null;
	public holdsHistory?: string | null;
	public unknownProps: Record<string, any> = {};

	constructor() {
	}

	build(): Effort {
		if (!this.id) throw new Error("id is required");
		return new Effort(
			this.id,
			this.title,
			this.prototype ?? null,
			this.parent ?? null,
			this.area ?? null,
			this.prerequisite ?? null,
			this.relates ?? null,
			this.status ?? null,
			this.votes ?? null,
			this.appetite ?? null,
			this.due ?? null,
			this.plannedStart ?? null,
			this.plannedEnd ?? null,
			this.started ?? null,
			this.ended ?? null,
			this.holdsHistory ?? null,
			this.unknownProps ?? null,
			this.body);
	}
}
