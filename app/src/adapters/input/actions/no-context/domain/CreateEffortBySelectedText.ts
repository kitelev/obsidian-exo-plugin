import ExoContext from "../../../../../../../common/ExoContext";
import Effort from "../../../../../../../core/src/domain/ems/effort/Effort";
import AbstractExoAction from "../../AbstractExoAction";
import ModalForm, {SelectField, SelectOption, TextField} from "../../../../../utils/modal/forms/ModalForm";
import {ConsumerAsync} from "../../../../../../../common/fp/Consumer";
import {UUID} from "node:crypto";
import Area from "../../../../../../../core/src/domain/ems/Area";

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

		const areas = await this.ctx.areaRepository.findAll();

		const fields = [
			new TextField("Title", selection),
			new SelectField("Area", [
				new SelectOption(undefined, ""),
				...areas.map(area => new SelectOption(area.id, area.name))
			])
		];
		const callback: ConsumerAsync<string[]> = async (fields) => {
			const title = fields[0] as string;
			const areaId = fields[1] ? fields[1] as UUID : undefined;
			let area: Area | null = null;
			if (areaId) {
				area = await this.ctx.areaRepository.findById(areaId);
			}

			let effort: Effort;
			if (activeKo instanceof Effort) {
				effort = await this.ctx.createEffortUseCase.taskUnderEffort(activeKo, title, area ?? undefined);
			} else {
				effort = await this.ctx.createEffortUseCase.createTask(title, area ?? undefined);
			}

			this.ctx.app.workspace.activeEditor!.editor!.replaceSelection(`[[${effort.title}]]`);
			await this.ctx.appUtils.openKObject(effort);
		};

		new ModalForm(this.ctx, "Enter effort title", fields, callback).open();
	}
}
