import KObject from "../KObject";
import {UUID} from "node:crypto";
import MOC from "./MOC";
import {KOC} from "../KOC";

export default class Simulacrum extends KObject {
	constructor(id: UUID,
				public moc: MOC) {
		super(id, KOC.IMS_SIMULACRUM);
	}
}
