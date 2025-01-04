import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import MOC from "../../../../core/src/domain/ims/MOC";

export default class MOCCreator extends AbstractCreator<MOC> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, fm: FrontMatterCache): Promise<MOC> {
		let parent: MOC | null = null;
		const parentStr: string = fm["moc-parent"];
		if (parentStr) {
			const file = this.ctx.appUtils.getTFileFromStrLink(parentStr);
			parent = await this.create(file);
		}

		return new MOC(id, file.name.replace(".md", ""), parent)
	}
}
