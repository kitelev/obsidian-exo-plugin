import MeetingRepository from "../../../../core/src/ports/output/MeetingRepository";
import Meeting from "../../../../core/src/domain/ems/meeting/Meeting";
import ExoContext from "../../../../common/ExoContext";
import Area from "../../../../core/src/domain/ems/Area";
import {TFile} from "obsidian";
import KObject from "../../../../core/src/domain/KObject";
import DateUtils from "../../../../common/utils/DateUtils";
import {KOC} from "../../../../core/src/domain/KOC";
import Effort from "../../../../core/src/domain/ems/effort/Effort";

export default class MeetingPersistenceAdapter implements MeetingRepository {
	constructor(private ctx: ExoContext) {
	}

	async save(meeting: Meeting): Promise<void> {
		const folderPath: string = this.ctx.meetingPathRulesHelper.getMeetingFolderPath(meeting)
		const filePath = folderPath + "/" + meeting.title + ".md";
		const fileContent = this.serialize(meeting);

		await this.ctx.appUtils.createFile(filePath, fileContent);
	}

	async update(meeting: Meeting): Promise<void> {
		const file = this.ctx.appUtils.getObjectFileOrThrow(meeting);
		const data = this.serialize(meeting);
		await this.ctx.appUtils.updateFile(file, data);
	}

	async find(filter: (e: Meeting) => boolean): Promise<Meeting[]> {
		let all = await this.findAll();
		return all.filter(filter);
	}

	async findAll(): Promise<Meeting[]> { // TODO move to AbstractPersistenceAdapter
		const rawMeetings: TFile[] = this.ctx.appUtils.findNotes((f: TFile) => {
			return this.ctx.appUtils.getTagsFromFile(f).includes(KOC.EMS_MEETING);
		});

		let promises = rawMeetings.map(async f => await this.ctx.kObjectCreator.createFromFileTyped(f) as Meeting);
		return await Promise.all(promises);
	}

	private serialize(meeting: Meeting) {
		let result = "";
		result += "---\n";
		result += "tags:\n";
		result += ` - ${meeting.koc}\n`;
		result += "uid: " + meeting.id + "\n";
		result += "e-status: " + meeting.status + "\n";
		if (meeting.started) {
			result += "started: " + DateUtils.formatTimestamp(meeting.started) + "\n";
		}
		if (meeting.ended) {
			result += "ended: " + DateUtils.formatTimestamp(meeting.ended) + "\n";
		}
		if (meeting.prototype) {
			result += "e-prototype: \'" + this.getLinkToKO(meeting.prototype) + "\'\n";
		}
		if (meeting.area) {
			result += "area: \'" + this.getLinkToArea(meeting.area) + "\'\n";
		}
		if (meeting.parentEffort) {
			result += "e-parent: \'" + this.getLinkToEffort(meeting.parentEffort) + "\'\n";
		}
		result += "---\n";
		result += meeting.body;
		return result;
	}

	private getLinkToKO(ko: KObject): string {
		let file = this.ctx.appUtils.getObjectFileOrThrow(ko);
		return `[[${file.basename}]]`;
	}

	private getLinkToArea(area: Area): string {
		return `[[${area.name}]]`;
	}

	private getLinkToEffort(parent: Effort): string {
		return `[[${parent.title}]]`;
	}
}
