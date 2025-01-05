import {KOC} from "../../../core/src/domain/KOC";

export default class KOCFactory {
	static create(tags: string[]) {
		if (tags.includes("IMS/MOC")) return KOC.IMS_MOC
		if (tags.includes("EMS/Area")) return KOC.EMS_AREA;
		if (tags.includes("EMS/Effort")) return KOC.EMS_EFFORT;
		if (tags.includes("TMS/DailyNote")) return KOC.TMS_DN;
		if (tags.includes("KMS/Property")) return KOC.KMS_PROPERTY;
		return KOC.UNKNOWN;
	}
}
