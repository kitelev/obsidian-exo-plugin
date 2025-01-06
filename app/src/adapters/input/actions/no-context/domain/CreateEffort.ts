import ExoContext from "../../../../../../../common/ExoContext";
import Area from "../../../../../../../core/src/domain/ems/Area";
import Effort from "../../../../../../../core/src/domain/ems/effort/Effort";
import EffortPrototype from "../../../../../../../core/src/domain/ems/effort/EffortPrototype";
import AbstractExoAction from "../../AbstractExoAction";
import KObject from "../../../../../../../core/src/domain/KObject";
import {ConsumerAsync} from "../../../../../../../common/fp/Consumer";
import ModalForm, {TextField} from "../../../../../utils/modal/forms/ModalForm";

export default class CreateEffort extends AbstractExoAction {
	name = "Create Effort";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const activeKo = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);

		const prefilledTitle = this.getPrefilledTitle(activeKo);
		await this.createAndOpen(activeKo, prefilledTitle);
	}

	private getPrefilledTitle(activeKo: KObject) {
		if (activeKo instanceof EffortPrototype) {
			return activeKo.title;
		} else {
			return undefined;
		}
	}

	private async createAndOpen(activeKo: KObject, prefilledTitle?: string) {
		const fields = [
			new TextField("Title", prefilledTitle)
		];
		const callback: ConsumerAsync<string[]> = async (fields) => {
			const title = fields[0] as string;
			const effort = await this.createEffort(activeKo, title);
			await this.ctx.appUtils.openKObject(effort);
		};
		new ModalForm(this.ctx, "Enter effort title", fields, callback).open();
	}

	private async createEffort(activeKo: KObject, title: string): Promise<Effort> {
		if (activeKo instanceof Area) {
			return await this.ctx.createEffortUseCase.taskUnderArea(activeKo, title);
		} else if (activeKo instanceof Effort) {
			return await this.ctx.createEffortUseCase.taskUnderEffort(activeKo);
		} else if (activeKo instanceof EffortPrototype) {
			return await this.ctx.createEffortUseCase.taskUnderPrototype(activeKo, title);
		} else {
			return await this.ctx.createEffortUseCase.createTask(title);
		}
	}
}
