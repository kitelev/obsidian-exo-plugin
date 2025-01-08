import KObject from "../KObject";
import {UUID} from "node:crypto";
import {KOC} from "../KOC";

export default class MOC extends KObject {
	static readonly CLASS = KOC.IMS_MOC;

	constructor(public id: UUID,
				public name: string,
				public parent: MOC | null) { // TODO add simulacrum field
		super(id, MOC.CLASS);
	}
}
