import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import AbstractLayout from "./AbstractLayout";
import EffortPrototype from "../../../../../../core/src/domain/ems/effort/EffortPrototype";
import CreateEffort from "../../actions/no-context/domain/CreateEffort";

export default class EffortPrototypeLayout extends AbstractLayout<EffortPrototype> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: EffortPrototype, el: HTMLElement): Promise<void> {
		await this.renderCreateImplementationButton(el);
		await this.handleUnresolvedImplementations(ko, el);
	}

	private async renderCreateImplementationButton(el: HTMLElement) {
		const button = this.createButton("Create implementation", async () => {
			let createEffortAction = new CreateEffort(this.ctx);
			await createEffortAction.execute();
		});

		el.appendChild(button);
	}

	private async handleUnresolvedImplementations(ko: EffortPrototype, el: HTMLElement) {
		const impls = await this.ctx.effortRepository.find(e => {
			if (e.isResolved()) {
				return false;
			}
			return e.prototype !== null && e.prototype.id === ko.id;
		});

		if (impls.length === 0) {
			return;
		}

		el.appendChild(this.createH1("Unresolved implementations"));
		let div = await this.dvRenderer.listKOs(impls.slice(0, 50));
		el.appendChild(div)
	}
}
