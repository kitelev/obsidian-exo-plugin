import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../../common/ExoContext";
import EffortPrototype from "../../../../../core/src/domain/ems/effort/EffortPrototype";
import EffortPrototypeSerde from "../serde/EffortPrototypeSerde";

export default class EffortPrototypeCreator extends AbstractCreator<EffortPrototype> {

	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile,
						 id: UUID,
						 title: string,
						 body: string,
						 fm: FrontMatterCache): Promise<EffortPrototype> {

		let serde = new EffortPrototypeSerde(this.ctx);
		return await serde.create(file, id, title, body, fm);
	}
}
