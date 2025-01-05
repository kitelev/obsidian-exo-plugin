import KObject from "../../KObject";
import {KOC} from "../../KOC";
import {UUID} from "node:crypto";
import Area from "../Area";
import Effort from "./Effort";

export default class EffortPrototype extends KObject {
	constructor(id: UUID,
				public area: Area | null,
				public effortParent: Effort | null) {
		super(id, KOC.EMS_EFFORT_PROTOTYPE);
	}
}
