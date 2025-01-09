import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import Effort from "../../../../../core/src/domain/ems/effort/Effort";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../../common/ExoContext";
import EffortSerde from "../serde/EffortSerde";

export default class EffortCreator extends AbstractCreator<Effort> {

	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile,
						 id: UUID,
						 title: string,
						 body: string,
						 fm: FrontMatterCache): Promise<Effort> {
		if (this.ctx.effortCache.get(id)) {
			return this.ctx.effortCache.get(id)!;
		}

		let effortSerde = new EffortSerde(this.ctx);
		let effort = await effortSerde.create(file, id, title, body, fm);
		this.ctx.effortCache.set(id, effort);
		return effort;
	}
}
