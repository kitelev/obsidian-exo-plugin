import ExoContext from "../../../../../../../common/ExoContext";
import Area from "../../../../../../../core/src/domain/ems/Area";
import Effort from "../../../../../../../core/src/domain/ems/effort/Effort";
import EffortPrototype from "../../../../../../../core/src/domain/ems/effort/EffortPrototype";
import AbstractExoAction from "../../AbstractExoAction";
import KObject from "../../../../../../../core/src/domain/KObject";
import {ConsumerAsync} from "../../../../../../../common/fp/Consumer";
import InputModal from "../../../../../utils/modal/forms/InputModal";

export default class CreateEffort extends AbstractExoAction {
	name = "Create Effort";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const activeKo = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);

		await this.createAndOpen(activeKo);
	}

	private async createAndOpen(activeKo: KObject) {
		const callback: ConsumerAsync<string> = async (title: string) => {
			const effort = await this.createEffort(activeKo, title);
			await this.ctx.appUtils.openKObject(effort);
		};

		new InputModal(this.ctx, callback).open();
	}

	private async createEffort(activeKo: KObject, title: string): Promise<Effort> {
		if (activeKo instanceof Area) {
			return await this.ctx.createEffortUseCase.taskUnderArea(activeKo, title);
		} else if (activeKo instanceof Effort) {
			return await this.ctx.createEffortUseCase.taskUnderEffort(activeKo);
		} else if (activeKo instanceof EffortPrototype) {
			return await this.ctx.createEffortUseCase.taskUnderPrototype(activeKo);
		} else {
			return await this.ctx.createEffortUseCase.createTask(title);
		}
	}
}
