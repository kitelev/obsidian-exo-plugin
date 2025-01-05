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
}
