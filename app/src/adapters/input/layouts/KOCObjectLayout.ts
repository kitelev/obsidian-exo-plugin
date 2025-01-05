import ExoContext from "../../../../../common/ExoContext";
import DvRenderer from "../../../utils/dv/DvRenderer";
import AbstractLayout from "./AbstractLayout";
import KOCObject from "../../../../../core/src/domain/KOCObject";
import {KOC} from "../../../../../core/src/domain/KOC";

export default class KOCObjectLayout extends AbstractLayout<KOCObject> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: KOCObject, el: HTMLElement): Promise<void> {
		if (ko.implKoc === KOC.UNKNOWN) {
			el.appendChild(this.createH1("Unknown KOC"))
			return;
		}
		await this.handleUnresolvedRelatedEfforts(ko, el);
		await this.handleImplementations(ko, el);
	}

	private async handleImplementations(ko: KOCObject, el: HTMLElement) {
		const impls = await this.ctx.kObjectRepository.findByKOC(ko.implKoc);
		if (impls.length === 0) {
			return;
		}

		el.appendChild(this.createH1("Implementations"));
		let div = await this.dvRenderer.listKOs(impls.slice(0, 50));
		el.appendChild(div)
	}
}
