import KObject from "../../KObject";
import {EffortStatus} from "./EffortStatus";
import {KOC} from "../../KOC";
import Area from "../Area";
import {UUID} from "node:crypto";
import EffortPrototype from "./EffortPrototype";

export default class Effort extends KObject { // TODO add builder pattern
	constructor(public id: UUID,
				public title: string,
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
				public relates: KObject[],
				public body: string) {
		super(id, KOC.EMS_EFFORT);
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
