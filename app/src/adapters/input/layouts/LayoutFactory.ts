import {KOC} from "../../../../../core/src/domain/KOC";
import ExoContext from "../../../../../common/ExoContext";
import KObject from "../../../../../core/src/domain/KObject";
import AreaLayoutDv from "./AreaLayout";
import DvRenderer from "../../../utils/dv/DvRenderer";
import Layout from "./Layout";
import EffortLayout from "./EffortLayout";
import DailyNoteLayout from "./DailyNoteLayout";

export default class LayoutFactory {
	constructor(private ctx: ExoContext) {
	}

	create(ko: KObject, dvRender: DvRenderer): Layout<KObject> | null {
		switch (ko.koc) {
			case KOC.EMS_AREA:
				return new AreaLayoutDv(this.ctx, dvRender);
			case KOC.EMS_EFFORT:
				return new EffortLayout(this.ctx, dvRender);
			case KOC.TMS_DN:
				return new DailyNoteLayout(this.ctx, dvRender);
			default:
				return null;
		}
	}
}
