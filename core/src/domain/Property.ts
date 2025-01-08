import KObject from "./KObject";
import {UUID} from "node:crypto";
import {KOC} from "./KOC";

export default class Property extends KObject {
	constructor(id: UUID,
				title: string,
				body: string) {
		super(id, KOC.KMS_PROPERTY, title, body);
	}
}
