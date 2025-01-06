import ExoContext from "../../../../../../../common/ExoContext";
import Area from "../../../../../../../core/src/domain/ems/Area";
import Effort from "../../../../../../../core/src/domain/ems/effort/Effort";
import EffortPrototype from "../../../../../../../core/src/domain/ems/effort/EffortPrototype";
import AbstractExoAction from "../../AbstractExoAction";

export default class CreateEffortBySelectedText extends AbstractExoAction {
	name = "Create Effort By Selected Text";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const selection = this.ctx.app.workspace.activeEditor?.editor?.getSelection();
		if (!selection) {
			throw new Error("No selection found");
		}

		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const activeKo = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);
		if (activeKo instanceof Area) {
			let effort = await this.ctx.createEffortUseCase.taskUnderArea(activeKo);
			await this.ctx.appUtils.openKObject(effort);
		}

		if (activeKo instanceof Effort) {
			let title = `(T) ${selection}`;
			let effort = await this.ctx.createEffortUseCase.taskUnderEffort(activeKo, title);
			this.ctx.app.workspace.activeEditor!.editor!.replaceSelection(`[[${title}]]`);
			await this.ctx.appUtils.openKObject(effort);
		}

		if (activeKo instanceof EffortPrototype) {
			let effort = await this.ctx.createEffortUseCase.taskUnderPrototype(activeKo);
			await this.ctx.appUtils.openKObject(effort);
		}
	}
}
