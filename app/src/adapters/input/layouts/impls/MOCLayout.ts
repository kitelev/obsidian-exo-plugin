import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import AbstractLayout from "./AbstractLayout";
import MOC from "../../../../../../core/src/domain/ims/MOC";

export default class MOCLayout extends AbstractLayout<MOC> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: MOC, el: HTMLElement): Promise<void> {
		await this.handleChildMOCs(ko, el);
		await this.handleInboundUnidirectionalLinks(ko, el);
		await this.handleUnresolvedRelatedEfforts(ko, el);
	}

	private async handleChildMOCs(ko: MOC, el: HTMLElement) {
		let links = await this.ctx.mocRepository.findChildren(ko);
		if (links.length > 0) {
			el.appendChild(this.createH1("Child MOCs"));
			let div = await this.dvRenderer.listKOs(links);
			el.appendChild(div);
		}
	}

	private async handleInboundUnidirectionalLinks(ko: MOC, el: HTMLElement) {
		let links = this.ctx.linksRegistry.getKoInboundUnidirectionalLinks(ko);
		if (links.length > 0) {
			el.appendChild(this.createH1("Inbound 1-directional links"));
			let div = await this.dvRenderer.listKOs(links);
			el.appendChild(div);
		}
	}

}
