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
		let effortSerde = new EffortSerde(this.ctx);
		return await effortSerde.createInternal(file, id, title, body, fm);

		// const builder = new EffortBuilder();
		// builder.id = id;
		// builder.title = title;
		// builder.body = body;
		// builder.status = fm["e-status"] as EffortStatus;
		//
		// if (fm["e-prototype"]) {
		// 	const file = this.ctx.appUtils.getFileFromStrLink(fm["e-prototype"]);
		// 	builder.prototype = await this.ctx.effortPrototypeCreator.create(file);
		// }
		//
		// builder.started = fm["started"] ? new Date(fm["started"]) : null;
		// builder.ended = fm["ended"] ? new Date(fm["ended"]) : null;
		// builder.plannedStart = fm["planned-start"] ? new Date(fm["planned-start"]) : null;
		// builder.plannedEnd = fm["planned-end"] ? new Date(fm["planned-end"]) : null;
		// builder.due = fm["due"] ? new Date(fm["due"]) : null;
		//
		// if (fm["area"]) {
		// 	const file = this.ctx.appUtils.getFileFromStrLink(fm["area"]);
		// 	builder.area = await this.ctx.areaCreator.create(file);
		// }
		//
		// if (fm["e-parent"]) {
		// 	const file = this.ctx.appUtils.getFileFromStrLink(fm["e-parent"]);
		// 	builder.parent = await this.create(file);
		// }
		//
		// builder.votes = fm["votes"];
		//
		// let relatesStrArr = fm["relates"] as string[];
		// if (relatesStrArr) {
		// 	builder.relates = await Promise.all(relatesStrArr.map(async str => {
		// 		const file = this.ctx.appUtils.getFileFromStrLink(str);
		// 		return await this.create(file);
		// 	}));
		// } else {
		// 	builder.relates = [];
		// }
		//
		//
		// return builder.build();
	}
}
