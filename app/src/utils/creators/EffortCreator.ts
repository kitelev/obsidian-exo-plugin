import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import Effort from "../../../../core/src/domain/ems/effort/Effort";
import {EffortStatus} from "../../../../core/src/domain/ems/effort/EffortStatus";
import Area from "../../../../core/src/domain/ems/Area";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import EffortPrototype from "../../../../core/src/domain/ems/effort/EffortPrototype";

export default class EffortCreator extends AbstractCreator<Effort> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, fm: FrontMatterCache): Promise<Effort> {
		const status: EffortStatus = fm["e-status"] as EffortStatus;

		let prototype: EffortPrototype | null = null;
		const prototypeStr: string = fm["e-prototype"];
		if (prototypeStr) {
			const file = this.ctx.appUtils.getFileFromStrLink(prototypeStr);
			prototype = await this.ctx.effortPrototypeCreator.create(file);
		}

		const started: Date | null = fm["started"] ? new Date(fm["started"]) : null;
		const ended: Date | null = fm["ended"] ? new Date(fm["ended"]) : null;
		const plannedStart: Date | null = fm["planned-start"] ? new Date(fm["planned-start"]) : null;
		const plannedEnd: Date | null = fm["planned-end"] ? new Date(fm["planned-end"]) : null;
		const due: Date | null = fm["due"] ? new Date(fm["due"]) : null;

		let area: Area | null = null;
		const areaStr: string = fm["area"];
		if (areaStr) {
			const file = this.ctx.appUtils.getFileFromStrLink(areaStr);
			area = await this.ctx.areaCreator.create(file);
		}

		let parent: Effort | null = null;
		const parentStr: string = fm["e-parent"];
		if (parentStr) {
			const file = this.ctx.appUtils.getFileFromStrLink(parentStr);
			parent = await this.create(file);
		}

		const votes: number = fm["votes"];

		let relates: Effort[] = [];
		const relatesStrArray: string[] = fm["relates"];
		if (relatesStrArray) {
			relates = await Promise.all(relatesStrArray.map(async str => {
				const file = this.ctx.appUtils.getFileFromStrLink(str);
				return await this.create(file);
			}));
		}

		const body: string = await this.ctx.appUtils.getFileBody(file);

		return new Effort(id, file.name.replace(".md", ""), status, started, ended, plannedStart, plannedEnd, due, prototype, area, parent, votes, relates, body);
	}
}
