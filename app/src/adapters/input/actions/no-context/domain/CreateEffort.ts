import ExoContext from "../../../../../../../common/ExoContext";
import Area from "../../../../../../../core/src/domain/ems/Area";
import Effort from "../../../../../../../core/src/domain/ems/effort/Effort";
import EffortPrototype from "../../../../../../../core/src/domain/ems/effort/EffortPrototype";
import AbstractExoAction from "../../AbstractExoAction";

export default class CreateEffort extends AbstractExoAction {
	name = "Create Effort";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const activeKo = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);
		if (activeKo instanceof Area) {
			let effort = await this.ctx.createEffortUseCase.taskUnderArea(activeKo);
			await this.ctx.appUtils.openKObject(effort);
		}

		if (activeKo instanceof Effort) {
			let effort = await this.ctx.createEffortUseCase.taskUnderEffort(activeKo);
			await this.ctx.appUtils.openKObject(effort);
		}

		if (activeKo instanceof EffortPrototype) {
			let effort = await this.ctx.createEffortUseCase.taskUnderPrototype(activeKo);
			await this.ctx.appUtils.openKObject(effort);
		}
	}
}
