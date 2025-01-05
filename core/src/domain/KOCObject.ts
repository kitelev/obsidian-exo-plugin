import KObject from "./KObject";
import {UUID} from "node:crypto";
import {KOC} from "./KOC";

export default class KOCObject extends KObject {
	constructor(id: UUID,
				public implKoc: KOC) {
		super(id, KOC.KMS_KOC);
	}
}
