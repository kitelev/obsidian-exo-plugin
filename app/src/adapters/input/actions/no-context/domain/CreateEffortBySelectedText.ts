import ExoContext from "../../../../../../../common/ExoContext";
import Effort from "../../../../../../../core/src/domain/ems/effort/Effort";
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

		let title = `${selection}`;
		if (activeKo instanceof Effort) {
			let effort = await this.ctx.createEffortUseCase.taskUnderEffort(activeKo, title);
			this.ctx.app.workspace.activeEditor!.editor!.replaceSelection(`[[${title}]]`);
			await this.ctx.appUtils.openKObject(effort);
		} else {
			let effort = await this.ctx.createEffortUseCase.createTask(title);
			this.ctx.app.workspace.activeEditor!.editor!.replaceSelection(`[[${title}]]`);
			await this.ctx.appUtils.openKObject(effort);
		}
	}
}
