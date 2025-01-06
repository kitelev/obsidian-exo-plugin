import {KOC} from "../../../core/src/domain/KOC";

export default class KOCFactory { // TODO needs refactoring
	static getFromTags(tags: string[]) { // TODO maybe always read first tag?
		if (tags.includes("IMS/MOC")) return KOC.IMS_MOC
		if (tags.includes("EMS/Area")) return KOC.EMS_AREA;
		if (tags.includes("EMS/Effort")) return KOC.EMS_EFFORT;
		if (tags.includes("EMS/Effort/Prototype")) return KOC.EMS_EFFORT_PROTOTYPE;
		if (tags.includes("EMS/Board")) return KOC.EMS_BOARD;
		if (tags.includes("TMS/DailyNote")) return KOC.TMS_DN;
		if (tags.includes("KMS/Property")) return KOC.KMS_PROPERTY;
		if (tags.includes("KOC")) return KOC.KMS_KOC;
		return KOC.UNKNOWN;
	}

	static getByValue(value: string): KOC {
		return (Object.values(KOC).includes(value as KOC) ? value : KOC.UNKNOWN) as KOC;
	}
}
