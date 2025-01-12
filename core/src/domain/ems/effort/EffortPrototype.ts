import KObject from "../../KObject";
import {KOC} from "../../KOC";
import {UUID} from "node:crypto";
import Area from "../Area";
import Effort from "./Effort";

export default class EffortPrototype extends KObject {

	static readonly CLASS = KOC.EMS_EFFORT_PROTOTYPE;

	constructor(id: UUID,
				title: string,
				body: string,
				public area: Area | null,
				public effortParent: Effort | null) {
		super(id, EffortPrototype.CLASS, title, body);
	}
}

export class EffortPrototypeBuilder {
	public id: UUID;
	public title: string;
	public body: string = "";
	public area?: Area | null;
	public effortParent?: Effort | null;

	constructor() {
	}

	build(): EffortPrototype {
		if (!this.id) throw new Error("id is required");
		return new EffortPrototype(
			this.id,
			this.title,
			this.body,
			this.area ?? null,
			this.effortParent ?? null
		);
	}
}
