import {EffortBuilder} from "../src/domain/ems/effort/Effort";
import {UUID} from "node:crypto";

export default class TestHelper {
	static createEffort() {
		const effortBuilder = new EffortBuilder();
		effortBuilder.id = crypto.randomUUID() as UUID;

		return effortBuilder.build();
	}

	static randomDate(): Date {
		return new Date(Math.random() * 1000000000000);
	}
}
