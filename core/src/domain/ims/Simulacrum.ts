import KObject from "../KObject";
import {UUID} from "node:crypto";
import MOC from "./MOC";
import {KOC} from "../KOC";

export default class Simulacrum extends KObject {

	static readonly CLASS = KOC.IMS_SIMULACRUM;

	constructor(id: UUID,
				title: string,
				body: string,
				public moc: MOC) {
		super(id, Simulacrum.CLASS, title, body);
	}
}
