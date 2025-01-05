import KObject from "./KObject";
import {UUID} from "node:crypto";
import {KOC} from "./KOC";

export default class Property extends KObject {
	constructor(id: UUID) {
		super(id, KOC.KMS_PROPERTY);
	}
}
