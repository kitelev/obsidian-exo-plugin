import KObject from "../KObject";
import {KOC} from "../KOC";
import {UUID} from "node:crypto";

export default class Area extends KObject {
	constructor(public id: UUID,
				public readonly name: string,
				public readonly parent: Area | null) {
		super(id, KOC.EMS_AREA);
	}

	isChildOf(area: Area): boolean {
		if (this.parent === null) return false;
		if (this.parent.id === area.id) return true;
		return this.parent.isChildOf(area);
	}
}