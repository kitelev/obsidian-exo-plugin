import ExoContext from "../../../../../common/ExoContext";
import DvRenderer from "../../../utils/dv/DvRenderer";
import AbstractLayout from "./AbstractLayout";
import Property from "../../../../../core/src/domain/Property";

export default class PropertyLayout extends AbstractLayout<Property> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: Property, el: HTMLElement): Promise<void> {
		await this.handleUnresolvedRelatedEfforts(ko, el);
	}

	private async handleUnresolvedRelatedEfforts(ko: Property, el: HTMLElement) {
		const efforts = await this.ctx.effortRepository.find(e => {
			if (e.isResolved()) {
				return false;
			}
			return e.related.some(r => r.id === ko.id);
		});

		if (efforts.length > 0) {
			el.appendChild(this.createH1("Unresolved related efforts"));
			let div = await this.dvRenderer.listKOs(efforts);
			el.appendChild(div);
		}
	}
}
