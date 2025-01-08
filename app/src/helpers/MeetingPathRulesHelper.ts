import ExoContext from "../../../common/ExoContext";
import Meeting from "../../../core/src/domain/ems/meeting/Meeting";
import KObject from "../../../core/src/domain/KObject";

export default class MeetingPathRulesHelper {
	private readonly INBOX_FOLDER_PATH: string = "/0 Inbox/";

	constructor(private ctx: ExoContext) {
	}

	getMeetingFolderPath(meeting: Meeting) {
		if (meeting.area !== null) {
			return this.getRelatedObjectFolderPath(meeting.area, "Area file has no parent folder");
		}

		if (meeting.parentEffort !== null) {
			return this.getRelatedObjectFolderPath(meeting.parentEffort, "Meeting parent file has no parent folder");
		}

		if (meeting.prototype !== null) {
			return this.getRelatedObjectFolderPath(meeting.prototype, "Meeting prototype file has no parent folder");
		}

		return this.INBOX_FOLDER_PATH;
	}

	private getRelatedObjectFolderPath(ko: KObject, noFolderMsg: string) {
		const areaFile = this.ctx.appUtils.getObjectFileOrThrow(ko);
		const areaFolder = areaFile.parent;
		if (!areaFolder) {
			console.warn(noFolderMsg);
			return this.INBOX_FOLDER_PATH;
		}

		return areaFolder.path;
	}
}
