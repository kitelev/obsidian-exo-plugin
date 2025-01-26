import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import Effort from "../../../../../core/src/domain/ems/effort/Effort";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../../common/ExoContext";
import EffortSerde from "../serde/EffortSerde";
import Exception from "../../../../../common/utils/Exception";

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

		const effortSerde = new EffortSerde(this.ctx);
		let effort: Effort;
		try {
			effort = await effortSerde.create(file, id, title, body, fm);
		} catch (e) {
			throw new Exception(`Error creating effort with id ${id}`, e);
		}
		this.ctx.effortCache.set(id, effort);
		return effort;
	}
}
