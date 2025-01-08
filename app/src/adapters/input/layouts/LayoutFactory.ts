import {KOC} from "../../../../../core/src/domain/KOC";
import ExoContext from "../../../../../common/ExoContext";
import KObject from "../../../../../core/src/domain/KObject";
import AreaLayoutDv from "./impls/AreaLayout";
import DvRenderer from "../../../utils/dv/DvRenderer";
import Layout from "./Layout";
import EffortLayout from "./impls/EffortLayout";
import DailyNoteLayout from "./impls/DailyNoteLayout";
import MOCLayout from "./impls/MOCLayout";
import PropertyLayout from "./impls/PropertyLayout";
import KOCObjectLayout from "./impls/KOCObjectLayout";
import EffortPrototypeLayout from "./impls/EffortPrototypeLayout";
import BoardLayout from "./impls/BoardLayout";
import MeetingPrototypeLayout from "./impls/MeetingPrototypeLayout";

export default class LayoutFactory {
	constructor(private ctx: ExoContext) {
	}

	create(ko: KObject, dvRender: DvRenderer): Layout<KObject> | null {
		switch (ko.koc) {
			case KOC.EMS_AREA:
				return new AreaLayoutDv(this.ctx, dvRender);
			case KOC.EMS_EFFORT:
				return new EffortLayout(this.ctx, dvRender);
			case KOC.EMS_EFFORT_PROTOTYPE:
				return new EffortPrototypeLayout(this.ctx, dvRender);
			case KOC.EMS_MEETING_PROTOTYPE:
				return new MeetingPrototypeLayout(this.ctx, dvRender);
			case KOC.EMS_BOARD:
				return new BoardLayout(this.ctx, dvRender);
			case KOC.TMS_DN:
				return new DailyNoteLayout(this.ctx, dvRender);
			case KOC.IMS_MOC:
				return new MOCLayout(this.ctx, dvRender);
			case KOC.KMS_PROPERTY:
				return new PropertyLayout(this.ctx, dvRender);
			case KOC.KMS_KOC:
				return new KOCObjectLayout(this.ctx, dvRender);
			default:
				return null;
		}
	}
}
