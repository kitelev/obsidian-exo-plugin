import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import AbstractLayout from "./AbstractLayout";
import MOC from "../../../../../../core/src/domain/ims/MOC";
import KObject from "../../../../../../core/src/domain/KObject";
import Simulacrum from "../../../../../../core/src/domain/ims/Simulacrum";

export default class MOCLayout extends AbstractLayout<MOC> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: MOC, el: HTMLElement): Promise<void> {
		const childMOCs = await this.ctx.mocRepository.findChildren(ko);
		const childSimulacrums = await this.ctx.simulacrumRepository.findByMOC(ko);

		await this.handleChildMOCs(childMOCs, el);
		await this.handleChildSimulacrums(childSimulacrums, el);

		const toExclude: KObject[] = [...childMOCs, ...childSimulacrums];
		await this.handleInboundUnidirectionalLinks(ko, toExclude, el);
		await this.handleUnresolvedRelatedEfforts(ko, el);
	}

	private async handleChildMOCs(mocs: MOC[], el: HTMLElement) {
		if (mocs.length <= 0) {
			return;
		}

		el.appendChild(this.createH1("Child MOCs"));
		let div = await this.dvRenderer.listKOs(mocs);
		el.appendChild(div);
	}

	private async handleChildSimulacrums(simulacrums: Simulacrum[], el: HTMLElement) {
		if (simulacrums.length <= 0) {
			return;
		}

		el.appendChild(this.createH1("Child Simulacrums"));
		let div = await this.dvRenderer.listKOs(simulacrums);
		el.appendChild(div);
	}

	private async handleInboundUnidirectionalLinks(ko: MOC, toExclude: KObject[], el: HTMLElement) {
		const inbounds = this.ctx.linksRegistry.getKoInboundUnidirectionalLinks(ko);
		const excludeIds = toExclude.map(ko => ko.id);
		const filtered = inbounds.filter(inbound => {
			return !excludeIds.some(idToExclude => inbound.id === idToExclude);
		});
		if (filtered.length > 0) {
			el.appendChild(this.createH1("Other Inbounds"));
			let div = await this.dvRenderer.listKOs(filtered);
			el.appendChild(div);
		}
	}

}
