import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import Effort from "../../../../core/src/domain/ems/effort/Effort";
import Area from "../../../../core/src/domain/ems/Area";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import EffortPrototype from "../../../../core/src/domain/ems/effort/EffortPrototype";

export default class EffortPrototypeCreator extends AbstractCreator<EffortPrototype> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, fm: FrontMatterCache): Promise<EffortPrototype> {
		let area: Area | null = null;
		const areaStr: string = fm["area"];
		if (areaStr) {
			const file = this.ctx.appUtils.getTFileFromStrLink(areaStr);
			area = await this.ctx.areaCreator.create(file);
		}

		let effortParent: Effort | null = null;
		const effortParentStr: string = fm["e-parent"];
		if (effortParentStr) {
			const file = this.ctx.appUtils.getTFileFromStrLink(effortParentStr);
			effortParent = await this.ctx.effortCreator.create(file);
		}

		return new EffortPrototype(id, area, effortParent);
	}
}
