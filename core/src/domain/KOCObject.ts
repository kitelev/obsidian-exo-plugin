import KObject from "./KObject";
import {UUID} from "node:crypto";
import {KOC} from "./KOC";

export default class KOCObject extends KObject {
	constructor(id: UUID,
				title: string,
				body: string,
				public implKoc: KOC) {
		super(id, KOC.KMS_KOC, title, body);
	}
}
