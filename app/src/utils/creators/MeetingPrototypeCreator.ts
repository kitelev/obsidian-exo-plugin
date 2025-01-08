import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import {FrontMatterCache, TFile} from "obsidian";
import Area from "../../../../core/src/domain/ems/Area";
import MeetingPrototype from "../../../../core/src/domain/ems/meeting/MeetingPrototype";
import {UUID} from "node:crypto";
import Effort from "../../../../core/src/domain/ems/effort/Effort";

export default class MeetingPrototypeCreator extends AbstractCreator<MeetingPrototype> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, fm: FrontMatterCache): Promise<MeetingPrototype> {
		const title: string = file.basename.replace(/\(.*\) /g, ""); // TODO move to AbstractCreator

		let area: Area | null = null;
		const areaStr: string = fm["area"];
		if (areaStr) {
			const file = this.ctx.appUtils.getFileFromStrLink(areaStr);
			area = await this.ctx.areaCreator.create(file);
		}

		let effortParent: Effort | null = null;
		const meetingParentStr: string = fm["e-parent"];
		if (meetingParentStr) {
			const file = this.ctx.appUtils.getFileFromStrLink(meetingParentStr);
			effortParent = await this.ctx.effortCreator.create(file);
		}

		return new MeetingPrototype(id, title, area, effortParent);
	}
}
