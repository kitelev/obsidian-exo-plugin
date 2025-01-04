import ExoContext from "../../../../../common/ExoContext";
import DvRenderer from "../../../utils/dv/DvRenderer";
import AbstractLayout from "./AbstractLayout";
import MOC from "../../../../../core/src/domain/ims/MOC";

export default class MOCLayout extends AbstractLayout<MOC> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: MOC, el: HTMLElement): Promise<void> {
		const file = this.ctx.appUtils.getObjectFileOrThrow(ko);
		const linksOutbound = this.ctx.linksRegistry.getFileOutboundLinks(file.path);
		const linksInbound = this.ctx.linksRegistry.getFileInboundLinks(file.path);
		console.log("linksOutbound", linksOutbound);
		console.log("linksInbound", linksInbound);

		// notes with inbound link but without outbound link
		const orphans = linksInbound.filter((inboundLink) => !linksOutbound.includes(inboundLink));
		console.log("orphans", orphans);

		// TODO not working!!
	}
}
