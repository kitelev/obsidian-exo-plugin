import KObject from "../KObject";
import {UUID} from "node:crypto";
import {KOC} from "../KOC";

export default class DailyNote extends KObject {

	static readonly CLASS = KOC.TMS_DN;

	constructor(public id: UUID,
				public date: Date) {
		super(id, DailyNote.CLASS);
	}
}
