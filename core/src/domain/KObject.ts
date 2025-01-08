import {KOC} from "./KOC";
import {UUID} from "node:crypto";

export default class KObject { // TODO add title as file.basename without prefix
	constructor(public readonly id: UUID,
				public readonly koc: KOC) {
	}
}
