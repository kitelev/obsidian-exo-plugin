import KObject from "../../KObject";
import {EffortStatus} from "./EffortStatus";
import {KOC} from "../../KOC";
import Area from "../Area";
import {UUID} from "node:crypto";
import EffortPrototype from "./EffortPrototype";

// TODO add validation - effort cannot have both prototype and (parent or area)
export default class Effort extends KObject {
	static readonly CLASS = KOC.EMS_EFFORT;

	constructor(id: UUID,
				title: string,
				public status: EffortStatus,
				public started: Date | null,
				public ended: Date | null,
				public plannedStart: Date | null,
				public plannedEnd: Date | null,
				public due: Date | null,
				public prototype: EffortPrototype | null,
				public area: Area | null,
				public parent: Effort | null,
				public votes: number | null,
				public relates: KObject[] = [],
				body: string) {
		super(id, Effort.CLASS, title, body);
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
}

export class EffortBuilder {
	public id: UUID;
	public title: string;
	public body: string = "";
	public status: EffortStatus = EffortStatus.DRAFT;
	public started?: Date | null;
	public ended?: Date | null;
	public plannedStart?: Date | null;
	public plannedEnd?: Date | null;
	public due?: Date | null;
	public prototype?: EffortPrototype | null;
	public area?: Area | null;
	public parent?: Effort | null;
	public votes?: number;
	public relates: KObject[] = [];

	constructor() {
	}

	build(): Effort {
		if (!this.id) throw new Error("id is required");
		return new Effort(
			this.id,
			this.title,
			this.status,
			this.started ?? null,
			this.ended ?? null,
			this.plannedStart ?? null,
			this.plannedEnd ?? null,
			this.due ?? null,
			this.prototype ?? null,
			this.area ?? null,
			this.parent ?? null,
			this.votes ?? null,
			this.relates,
			this.body);
	}
}
