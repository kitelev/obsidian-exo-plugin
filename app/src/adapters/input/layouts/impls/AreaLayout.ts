import ExoContext from "../../../../../../common/ExoContext";
import Area from "../../../../../../core/src/domain/ems/Area";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import AbstractLayout, {EffortFieldEnum} from "./AbstractLayout";
import CreateEffort from "../../actions/no-context/domain/CreateEffort";
import EffortPrototype from "../../../../../../core/src/domain/ems/effort/EffortPrototype";
import CreateArea from "../../actions/no-context/domain/CreateArea";

export default class AreaLayout extends AbstractLayout<Area> {
	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: Area, el: HTMLElement): Promise<void> {
		await this.createChildAreaButton(el);
		await this.createCreateEffortButton(el);
		await this.handleChildren(ko, el);
		await this.handleEffortPrototypes(ko, el);
		await this.handleUnresolvedEfforts(ko, el);
	}

	private async createChildAreaButton(el: HTMLElement) {
		const button = this.createButton("Create child Area", async () => {
			const createAreaAction = new CreateArea(this.ctx);
			await createAreaAction.execute();
		});

		el.appendChild(button);
	}

	private async createCreateEffortButton(el: HTMLElement) {
		const button = this.createButton("Create Effort", async () => {
			const createEffortAction = new CreateEffort(this.ctx);
			await createEffortAction.execute();
		});

		el.appendChild(button);
	}

	private async handleChildren(ko: Area, el: HTMLElement) {
		const children = await this.ctx.areaRepository.findChildren(ko);
		if (children.length === 0) return;


		const header = this.createH1("Child Areas");
		el.appendChild(header);

		const div = await this.dvRenderer.listKOs(children);
		el.appendChild(div)
	}

	private async handleEffortPrototypes(ko: Area, el: HTMLElement) {
		const prototypes: EffortPrototype[] = await this.ctx.effortPrototypeRepository.findByArea(ko);
		if (prototypes.length === 0) return;

		const header = this.createH1("Effort Prototypes");
		el.appendChild(header);

		const div = await this.dvRenderer.listKOs(prototypes);
		el.appendChild(div)
	}

	private async handleUnresolvedEfforts(ko: Area, el: HTMLElement) {
		const unresolvedEfforts = await this.ctx.effortRepository.find(e => {
			if (e.getRelatedArea() === null) {
				return false;
			}
			if (e.parent !== null) {
				return false;
			}
			const sameArea = e.isInAreaOrOneOfItsParents(ko);
			const unresolved = e.isUnresolved();
			return sameArea && unresolved;
		});

		if (unresolvedEfforts.length > 0) {
			const header = this.createH1("Unresolved Efforts");
			el.appendChild(header);

			const fieldsToRender = this.getFieldsToRender(ko);
			const fieldsToSort = this.getFieldsToSort(ko);
			const dvTable = await this.createTableSuper(unresolvedEfforts, fieldsToRender, fieldsToSort);
			el.appendChild(dvTable)
		}
	}

	private getFieldsToRender(area: Area) {
		const defaultFieldsToRender = [EffortFieldEnum.AREA, EffortFieldEnum.STATUS, EffortFieldEnum.VOTES, EffortFieldEnum.DUE]

		if (!area.fieldsToRender) {
			return defaultFieldsToRender;
		}

		const fieldsToRender: EffortFieldEnum[] = [];
		for (const fieldName of area.fieldsToRender) {
			fieldsToRender.push(this.toEnumField(fieldName));
		}
		return fieldsToRender;
	}

	private getFieldsToSort(area: Area) {
		const defaultSort = [EffortFieldEnum.STATUS, EffortFieldEnum.DUE, EffortFieldEnum.VOTES, EffortFieldEnum.AREA];

		if (!area.sortBy) {
			return defaultSort;
		}

		const sortingFields: EffortFieldEnum[] = [];
		for (const fieldName of area.sortBy) {
			sortingFields.push(this.toEnumField(fieldName));
		}
		return sortingFields;
	}

	private toEnumField(fieldName: string): EffortFieldEnum {
		switch (fieldName) {
			case "area":
				return EffortFieldEnum.AREA;
			case "status":
				return EffortFieldEnum.STATUS;
			case "votes":
				return EffortFieldEnum.VOTES;
			case "due":
				return EffortFieldEnum.DUE;
			default:
				throw new Error("Invalid field name " + fieldName);
		}
	}
}
