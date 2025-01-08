import ExoContext from "../../../common/ExoContext";
import Effort from "../../../core/src/domain/ems/effort/Effort";
import KObject from "../../../core/src/domain/KObject";

export default class KObjectPathRulesHelper {
	private readonly INBOX_FOLDER_PATH: string = "/0 Inbox/";

	constructor(private ctx: ExoContext) {
	}

	getFolderPath(ko: KObject) {
		if (ko instanceof Effort) {
			const effort = ko as Effort;
			if (effort.area !== null) {
				return this.getRelatedObjectFolderPath(effort.area, "Area file has no parent folder");
			}

			if (effort.parent !== null) {
				return this.getRelatedObjectFolderPath(effort.parent, "Effort parent file has no parent folder");
			}

			if (effort.prototype !== null) {
				return this.getRelatedObjectFolderPath(effort.prototype, "Effort prototype file has no parent folder");
			}
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
