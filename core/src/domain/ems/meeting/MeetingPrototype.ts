import KObject from "../../KObject";
import {KOC} from "../../KOC";
import {UUID} from "node:crypto";
import Area from "../Area";
import Effort from "../effort/Effort";

export default class MeetingPrototype extends KObject {
	constructor(id: UUID,
				public title: string,
				public area: Area | null,
				public effortParent: Effort | null) {
		super(id, KOC.EMS_MEETING_PROTOTYPE);
	}
}
