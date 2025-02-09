import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";
import AbstractLayout, {EffortFieldEnum} from "./AbstractLayout";
import {Notice} from "obsidian";

export default class EffortLayout extends AbstractLayout<Effort> {
	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: Effort, el: HTMLElement): Promise<void> {
		await this.showAvailableActions(ko, el);
		await this.handleChildren(ko, el);
		await this.handleRelatedEfforts(ko, el);
	}

	private async showAvailableActions(effort: Effort, el: HTMLElement) {
		const startButton = this.createButton("Start", async () => {
			await this.ctx.effortCommandFactory.createStartEffortCommand().execute(effort);
			new Notice("Effort started");
		});
		el.appendChild(startButton);

		const endButton = this.createButton("End", async () => {
			await this.ctx.effortCommandFactory.createEndEffortCommand().execute(effort);
			new Notice("Effort ended");
		});
		el.appendChild(endButton);
	}

	private async handleChildren(ko: Effort, el: HTMLElement) {
		const childEfforts = await this.ctx.effortRepository.find(e => {
			if (!e.parent) {
				return false;
			}
			return e.parent.id == ko.id;
		});

		if (childEfforts.length > 0) {
			const childEffortsH1 = this.createH1("Child Efforts");
			el.appendChild(childEffortsH1);


			const unresolved = childEfforts.filter(e => e.isUnresolved());
			if (unresolved.length > 0) {
				const unresolvedEffortsH2 = this.createH2("Unresolved");
				el.appendChild(unresolvedEffortsH2);

				const fieldsToRender = [EffortFieldEnum.STATUS];
				const dvTable = await this.createTableSuper(unresolved, fieldsToRender);
				el.appendChild(dvTable);
			}

			const resolved = childEfforts.filter(e => e.isResolved());
			if (resolved.length > 0) {
				const resolvedEffortsH2 = this.createH2("Resolved");
				el.appendChild(resolvedEffortsH2);

				const fieldsToRender = [EffortFieldEnum.STATUS];
				const resolvedDvTable = await this.createTableSuper(resolved, fieldsToRender);
				el.appendChild(resolvedDvTable);
			}
		}
	}
}
