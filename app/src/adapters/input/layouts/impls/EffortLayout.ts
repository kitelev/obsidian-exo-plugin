import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";
import AbstractLayout, {EffortFieldEnum} from "./AbstractLayout";
import EffortAction from "../../../../../../core/src/domain/ems/effort/EffortAction";

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
		const actionsToShow = EffortAction.ALL.filter(a => a.availableFor(effort));

		if (actionsToShow.length == 0) {
			return;
		}

		for (let action of actionsToShow) {
			const actionButton = this.createButton(action.name, async () => {
				await this.ctx.loggingFacade.logMsg(`Executing action "${action.name}" on effort ${effort.id}...`);
				await this.ctx.effortService.execute(effort, action);
				await this.ctx.loggingFacade.logMsg(`Action "${action.name}" executed on effort ${effort.id}`);
			});
			el.appendChild(actionButton);
		}
	}

	private async handleChildren(ko: Effort, el: HTMLElement) {
		const childEfforts = await this.ctx.effortRepository.find(e => {
			if (!e.getClosestParent() || e.getClosestParent() === null) {
				return false;
			}
			return e.getClosestParent()!.id == ko.id;
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
