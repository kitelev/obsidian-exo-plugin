import ExoContext from "../../../../../../common/ExoContext";
import Area from "../../../../../../core/src/domain/ems/Area";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import AbstractLayout, {EffortFieldEnum} from "./AbstractLayout";
import CreateEffort from "../../actions/no-context/domain/CreateEffort";

export default class AreaLayout extends AbstractLayout<Area> {
	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: Area, el: HTMLElement): Promise<void> {
		await this.createCreateEffortButton(el);
		await this.handleChildren(ko, el);
		await this.handleUnresolvedEfforts(ko, el);
	}

	private async createCreateEffortButton(el: HTMLElement) {
		const button = this.createButton("Create Effort", async () => {
			let createEffortAction = new CreateEffort(this.ctx);
			await createEffortAction.execute();
		});

		el.appendChild(button);
	}

	private async handleChildren(ko: Area, el: HTMLElement) {
		const children = await this.ctx.areaRepository.findChildren(ko);
		if (children.length === 0) return;


		let header = this.createH1("Child Areas");
		el.appendChild(header);

		let div = await this.dvRenderer.listKOs(children);
		el.appendChild(div)
	}

	private async handleUnresolvedEfforts(ko: Area, el: HTMLElement) {
		const unresolvedEfforts = await this.ctx.effortRepository.find(e => {
			if (e.getRelatedArea() === null) {
				return false;
			}
			const sameArea = e.isInAreaOrOneOfItsParents(ko);
			const unresolved = e.isUnresolved();
			return sameArea && unresolved;
		});

		if (unresolvedEfforts.length > 0) {
			let header = this.createH1("Unresolved Efforts");
			el.appendChild(header);

			const fieldsToRender = [EffortFieldEnum.AREA, EffortFieldEnum.STATUS, EffortFieldEnum.VOTES];
			const fieldsToSort = [EffortFieldEnum.STATUS, EffortFieldEnum.VOTES];
			const dvTable = await this.createTableSuper(unresolvedEfforts, fieldsToRender, fieldsToSort);
			el.appendChild(dvTable)
		}
	}
}
