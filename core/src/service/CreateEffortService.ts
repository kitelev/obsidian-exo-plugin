import CreateEffortUseCase from "../ports/input/CreateEffortUseCase";
import Area from "../domain/ems/Area";
import {EffortStatus} from "../domain/ems/effort/EffortStatus";
import Effort from "../domain/ems/effort/Effort";
import ExoContext from "../../../common/ExoContext";
import EffortPrototype from "../domain/ems/effort/EffortPrototype";

export default class CreateEffortService implements CreateEffortUseCase {
	constructor(private ctx: ExoContext) {
	}

	async createTask(title: string): Promise<Effort> {
		const id = this.ctx.utils.generateUid();
		const effort = new Effort(id, title, EffortStatus.DRAFT, null, null, null, null, null, null, null, null, 0, [], "");

		await this.ctx.effortRepository.save(effort);

		return effort;
	}

	async taskUnderArea(area: Area, title?: string): Promise<Effort> {
		title = title ?? this.ctx.utils.generateUid();
		const id = this.ctx.utils.generateUid();
		const effort = new Effort(id, `(T) ${title}`, EffortStatus.DRAFT, null, null, null, null, null, null, area, null, 0, [], "");

		await this.ctx.effortRepository.save(effort);

		return effort;
	}

	async taskUnderEffort(parentEffort: Effort, title: string | undefined): Promise<Effort> {
		title = title ?? this.ctx.utils.generateUid();
		const id = this.ctx.utils.generateUid();
		const effort = new Effort(id, `(T) ${title}`, EffortStatus.DRAFT, null, null, null, null, null, null, null, parentEffort, 0, [], "");

		await this.ctx.effortRepository.save(effort);

		return effort;
	}

	async taskUnderPrototype(prototype: EffortPrototype, title?: string): Promise<Effort> {
		title = title ?? this.ctx.utils.generateUid();
		const id = this.ctx.utils.generateUid();
		const effort = new Effort(id, `(T) ${title}`, EffortStatus.DRAFT, null, null, null, null, null, prototype, null, null, 0, [], "");

		await this.ctx.effortRepository.save(effort);

		return effort;
	}
}
