import ExoContext from "../../../common/ExoContext";
import Effort from "../../../core/src/domain/ems/effort/Effort";
import KObject from "../../../core/src/domain/KObject";
import Property from "../../../core/src/domain/Property";
import MOC from "../../../core/src/domain/ims/MOC";
import Simulacrum from "../../../core/src/domain/ims/Simulacrum";
import Area from "../../../core/src/domain/ems/Area";

export default class KObjectPathRulesHelper {
	private readonly INBOX_FOLDER_PATH: string = "/0 Inbox/";

	constructor(private ctx: ExoContext) {
	}

	/**
	 * Returns the folder path where the given KObject should be moved to.
	 */
	getFolderPath(ko: KObject) {
		if (ko instanceof Effort) {
			const effort = ko as Effort;
			if (effort.area !== null) {
				let res = this.getKoFolder(effort.area, "Area file has no parent folder");
				res += "/- E";
				if (ko.isResolved()) {
					res += "/- Archive"
				}
				return res;
			}

			if (effort.parent !== null) {
				let res = this.getKoFolder(effort.parent, "Effort parent file has no parent folder");
				res += "/- E";
				if (ko.isResolved()) {
					res += "/- Archive"
				}
				return res;
			}

			if (effort.prototype !== null) {
				let res = this.getKoFolder(effort.prototype, "Effort prototype file has no parent folder");
				if (ko.isResolved()) {
					res += "/- Archive"
				}
				return res;
			}
		}

		if (ko instanceof Property) {
			return "/9 Meta/4 Domain Properties"
		}

		if (ko instanceof MOC) {
			const moc = ko as MOC;
			if (moc.parent !== null) {
				let res = this.getKoFolder(moc.parent, "MOC parent file has no parent folder");
				res += "/" + moc.getTitleWithoutPrefix();
				return res;
			}
		}

		if (ko instanceof Simulacrum) {
			const simulacrum = ko as Simulacrum;
			return this.getKoFolder(simulacrum.moc, "MOC file has no parent folder");
		}

		if (ko instanceof Area) {
			const area = ko as Area;
			if (area.parent !== null) {
				let res = this.getKoFolder(area.parent, "Area parent file has no parent folder");
				res += "/" + area.title;
				return res;
			}
		}

		return this.INBOX_FOLDER_PATH;
	}


	private getKoFolder(ko: KObject, noFolderMsg: string) {
		const areaFile = this.ctx.appUtils.getObjectFileOrThrow(ko);
		const koFolder = areaFile.parent;
		if (!koFolder) {
			throw new Error(noFolderMsg);
		}

		return koFolder.path;
	}
}
