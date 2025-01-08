import AbstractExoAction from "../../AbstractExoAction";
import ExoContext from "../../../../../../../common/ExoContext";
import KObject from "../../../../../../../core/src/domain/KObject";
import MeetingPrototype from "../../../../../../../core/src/domain/ems/meeting/MeetingPrototype";
import ModalForm, {TextField} from "../../../../../utils/modal/forms/ModalForm";
import {ConsumerAsync} from "../../../../../../../common/fp/Consumer";
import Area from "../../../../../../../core/src/domain/ems/Area";
import Meeting from "../../../../../../../core/src/domain/ems/meeting/Meeting";
import Effort from "../../../../../../../core/src/domain/ems/effort/Effort";
import {CreateMeetingCommand} from "../../../../../../../core/src/ports/input/CreateMeetingUseCase";

export default class CreateMeeting extends AbstractExoAction {
	name = "Create Meeting";

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
		if (activeKo instanceof MeetingPrototype || activeKo instanceof Effort) {
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
			const Meeting = await this.createMeeting(activeKo, title);
			await this.ctx.appUtils.openKObject(Meeting);
		};
		new ModalForm(this.ctx, "Meeting creation form", fields, callback).open();
	}

	private async createMeeting(activeKo: KObject, title: string): Promise<Meeting> {
		let cmd = this.createCommand(activeKo, title);
		return await this.ctx.createMeetingUseCase.create(cmd);
	}

	private createCommand(activeKo: KObject, title: string): CreateMeetingCommand {
		if (activeKo instanceof Area) {
			return {title, area: activeKo};
		} else if (activeKo instanceof Effort) {
			return {title, parentEffort: activeKo};
		} else if (activeKo instanceof MeetingPrototype) {
			return {title, prototype: activeKo};
		} else {
			return {title};
		}
	}
}
