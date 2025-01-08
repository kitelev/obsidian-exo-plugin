import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import {FrontMatterCache, TFile} from "obsidian";
import Meeting, {MeetingBuilder} from "../../../../core/src/domain/ems/meeting/Meeting";
import {UUID} from "node:crypto";
import {EffortStatus} from "../../../../core/src/domain/ems/effort/EffortStatus";

export default class MeetingCreator extends AbstractCreator<Meeting> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, fm: FrontMatterCache): Promise<Meeting> {
		const builder = new MeetingBuilder();
		builder.id = id; // TODO move to AbstractCreator
		builder.title = file.name.replace(".md", ""); // TODO move to AbstractCreator
		builder.body = await this.ctx.appUtils.getFileBody(file);
		builder.status = fm["e-status"] as EffortStatus;

		if (fm["e-prototype"]) {
			const file = this.ctx.appUtils.getFileFromStrLink(fm["e-prototype"]);
			builder.prototype = await this.ctx.meetingPrototypeCreator.create(file);
		}

		builder.started = fm["started"] ? new Date(fm["started"]) : null;
		builder.ended = fm["ended"] ? new Date(fm["ended"]) : null;
		builder.plannedStart = fm["planned-start"] ? new Date(fm["planned-start"]) : null;
		builder.plannedEnd = fm["planned-end"] ? new Date(fm["planned-end"]) : null;

		if (fm["area"]) {
			const file = this.ctx.appUtils.getFileFromStrLink(fm["area"]);
			builder.area = await this.ctx.areaCreator.create(file);
		}

		if (fm["e-parent"]) {
			const file = this.ctx.appUtils.getFileFromStrLink(fm["e-parent"]);
			builder.parentEffort = await this.ctx.effortCreator.create(file);
		}

		let relatesStrArr = fm["relates"] as string[];
		if (relatesStrArr) {
			builder.relates = await Promise.all(relatesStrArr.map(async str => {
				const file = this.ctx.appUtils.getFileFromStrLink(str);
				return await this.create(file);
			}));
		}

		return builder.build();
	}
}
