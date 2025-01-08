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
				...areas.map(area => new SelectOption(area.id, area.title))
			])
		];
		const callback: ConsumerAsync<string[]> = async (fields) => {
			const title = fields[0] as string;

			const areaId = fields[1] ? fields[1] as UUID : undefined;
			const area: Area | null = areaId ? await this.ctx.areaRepository.findById(areaId) : null;

			const parent: Effort | null = activeKo instanceof Effort ? activeKo : null;

			const effort = await this.ctx.createEffortUseCase.create({title, parent, area});

			this.ctx.app.workspace.activeEditor!.editor!.replaceSelection(`[[${effort.title}]]`);
			await this.ctx.appUtils.openKObject(effort);
		};

		new ModalForm(this.ctx, "Enter effort title", fields, callback).open();
	}
}
