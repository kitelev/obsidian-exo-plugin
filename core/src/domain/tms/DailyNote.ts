import KObject from "../KObject";
import {UUID} from "node:crypto";
import {KOC} from "../KOC";

export default class DailyNote extends KObject {

	static readonly CLASS = KOC.TMS_DN;

	constructor(id: UUID,
				title: string,
				body: string,
				public date: Date) {
		super(id, DailyNote.CLASS, title, body);
	}
}
