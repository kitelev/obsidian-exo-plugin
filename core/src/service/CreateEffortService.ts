import CreateEffortUseCase, {CreateEffortCommand} from "../ports/input/CreateEffortUseCase";
import {EffortStatus} from "../domain/ems/effort/EffortStatus";
import Effort, {EffortBuilder} from "../domain/ems/effort/Effort";
import ExoContext from "../../../common/ExoContext";

export default class CreateEffortService implements CreateEffortUseCase {
	constructor(private ctx: ExoContext) {
	}

	async create(cmd: CreateEffortCommand): Promise<Effort> {
		const builder = new EffortBuilder();
		builder.id = this.ctx.utils.generateUid();
		builder.title = `(T) ${cmd.title}`;
		builder.prototype = cmd.prototype;
		builder.area = cmd.area;
		builder.parent = cmd.parent;
		builder.status = EffortStatus.DRAFT;

		if (this.titleEndsWithDate(cmd.title)) {
			builder.plannedStart = new Date(cmd.title.slice(-10));
			builder.plannedStart.setHours(8, 0, 0, 0);
			builder.plannedEnd = new Date(cmd.title.slice(-10));
			builder.plannedEnd.setHours(22, 0, 0, 0);
		}

		const effort = builder.build();

		await this.ctx.effortRepository.save(effort);

		return effort;
	}

	private titleEndsWithDate(title: string): boolean {
		const dateRegex = /\b\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
		return dateRegex.test(title);
	}
}
