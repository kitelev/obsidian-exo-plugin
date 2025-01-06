import KObject from "../KObject";
import {UUID} from "node:crypto";
import {KOC} from "../KOC";
import Area from "./Area";

export default class Board extends KObject {
	constructor(id: UUID,
				public area: Area) {
		super(id, KOC.EMS_BOARD);
	}
}