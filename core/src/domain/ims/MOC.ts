import KObject from "../KObject";
import {UUID} from "node:crypto";
import {KOC} from "../KOC";

export default class MOC extends KObject {
	constructor(public id: UUID,
				public name: string,
				public parent: MOC | null) {
		super(id, KOC.IMS_MOC);
	}
}
