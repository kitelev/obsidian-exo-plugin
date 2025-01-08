import {KOC} from "./KOC";
import {UUID} from "node:crypto";

export default class KObject {
	constructor(public readonly id: UUID,
				public readonly koc: KOC,
				public readonly title: string,
				public readonly body: string) {
	}

	getTitleWithoutPrefix(): string {
		return this.title.replace(/\(.*\)/g, "");
	}
}
