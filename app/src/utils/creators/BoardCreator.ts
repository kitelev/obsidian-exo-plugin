import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import Board from "../../../../core/src/domain/ems/Board";

export default class BoardCreator extends AbstractCreator<Board> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, fm: FrontMatterCache): Promise<Board> {
		const area = await this.parseArea(fm);
		return new Board(id, area);
	}

	private async parseArea(fm: FrontMatterCache) {
		if (!fm["area"]) throw new Error("Board must have an area");
		const areaStr: string = fm["area"];
		const areaFile = this.ctx.appUtils.getFileFromStrLink(areaStr);
		return await this.ctx.areaCreator.create(areaFile);
	}
}
