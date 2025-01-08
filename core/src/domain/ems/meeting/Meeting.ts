import KObject from "../../KObject";
import {UUID} from "node:crypto";
import {EffortStatus} from "../effort/EffortStatus";
import MeetingPrototype from "./MeetingPrototype";
import Area from "../Area";
import Effort from "../effort/Effort";
import {KOC} from "../../KOC";
import EffortPrototype from "../effort/EffortPrototype";

// TODO should extend Effort
// TODO add validation - meeting cannot have both prototype and (parent or area)
export default class Meeting extends KObject {
	constructor(public id: UUID,
				public title: string,
				public status: EffortStatus,
				public started: Date | null,
				public ended: Date | null,
				public plannedStart: Date | null,
				public plannedEnd: Date | null,
				public prototype: MeetingPrototype | null,
				public area: Area | null,
				public parentEffort: Effort | null,
				public relates: KObject[],
				public body: string) {
		super(id, KOC.EMS_MEETING);
	}

	start() {
		this.started = new Date();
		this.status = EffortStatus.STARTED;
	}

	end() {
		this.ended = new Date();
		this.status = EffortStatus.ENDED;
	}

	getRelatedArea(): Area | null {
		if (this.area !== null) return this.area;
		if (this.prototype !== null) return this.prototype.area;
		if (this.parentEffort !== null) return this.parentEffort.getRelatedArea();
		return null;
	}

	/**
	 * Returns true if this effort is in the given area or one of its parents
	 */
	isInAreaOrOneOfItsParents(area: Area): boolean {
		if (this.getRelatedArea() === null) return false;
		if (this.getRelatedArea()!.id === area.id) return true;
		return this.getRelatedArea()!.isChildOf(area);
	}

	isResolved(): boolean {
		return this.status === EffortStatus.ENDED || this.status === EffortStatus.TRASHED;
	}

	isUnresolved(): boolean {
		return !this.isResolved();
	}
}

export class MeetingBuilder {
	public id: UUID;
	public title: string;
	public status: EffortStatus = EffortStatus.DRAFT;
	public started?: Date | null;
	public ended?: Date | null;
	public plannedStart?: Date | null;
	public plannedEnd?: Date | null;
	public prototype?: EffortPrototype | null;
	public area?: Area | null;
	public parentEffort?: Effort | null;
	public relates: KObject[] = [];
	public body: string = "";

	constructor() {
	}

	build(): Meeting {
		if (!this.id) throw new Error("id is required");
		return new Meeting(
			this.id,
			this.title,
			this.status,
			this.started ?? null,
			this.ended ?? null,
			this.plannedStart ?? null,
			this.plannedEnd ?? null,
			this.prototype ?? null,
			this.area ?? null,
			this.parentEffort ?? null,
			this.relates,
			this.body);
	}
}
