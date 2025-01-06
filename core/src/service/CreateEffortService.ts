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
		const effort = builder.build();

		await this.ctx.effortRepository.save(effort);

		return effort;
	}
}
