import {FrontMatterCache, TFile} from "obsidian";
import Area from "../../../../../core/src/domain/ems/Area";
import {UUID} from "node:crypto";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../../common/ExoContext";

export default class AreaCreator extends AbstractCreator<Area> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, title: string, body: string, fm: FrontMatterCache): Promise<Area> {
		let parentArea: Area | null = null;
		const parentStr: string = fm["a-parent"];
		if (parentStr) {
			const file = this.ctx.appUtils.getFileFromStrLink(parentStr);
			parentArea = await this.create(file);
		}

		let fieldsToRender: string[] | undefined;
		if (fm["fields-to-render"]) {
			fieldsToRender = fm["fields-to-render"];
		}

		let sortBy: string[] | undefined;
		if (fm["sort-by"]) {
			sortBy = fm["sort-by"];
		}

		return new Area(id, title, body, parentArea, fieldsToRender, sortBy)
	}
}
