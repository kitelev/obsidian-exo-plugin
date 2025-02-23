import AbstractExoAction from "../../AbstractExoAction";
import ExoContext from "../../../../../../../common/ExoContext";
import KObject from "../../../../../../../core/src/domain/KObject";
import ModalForm, {TextField} from "../../../../../utils/modal/forms/ModalForm";
import {ConsumerAsync} from "../../../../../../../common/fp/Consumer";
import {CreateAreaCommand} from "../../../../../../../core/src/ports/input/CreateAreaUseCase";
import Area from "../../../../../../../core/src/domain/ems/Area";

export default class CreateArea extends AbstractExoAction {
	name = "Create Area";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const activeFile = this.ctx.appUtils.getActiveFileOrThrow();
		const activeKo = await this.ctx.kObjectCreator.createFromFileTyped(activeFile);

		await this.createAndOpen(activeKo);
	}

	private async createAndOpen(activeKo: KObject) {
		const fields = [
			new TextField("Title")
		];
		const callback: ConsumerAsync<string[]> = async (fields) => {
			const title = fields[0] as string;
			const effort = await this.createArea(activeKo, title);
			await this.ctx.appUtils.openKObject(effort);
		};
		new ModalForm(this.ctx, "Enter area title", fields, callback).open();
	}

	private async createArea(activeKo: KObject, title: string): Promise<Area> {
		const cmd: CreateAreaCommand = {title};

		if (activeKo instanceof Area) {
			cmd.parent = activeKo;
		}

		return await this.ctx.createAreaUseCase.create(cmd);
	}
}
