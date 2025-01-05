import CreateEffortUseCase from "../ports/input/CreateEffortUseCase";
import Area from "../domain/ems/Area";
import {EffortStatus} from "../domain/ems/effort/EffortStatus";
import Effort from "../domain/ems/effort/Effort";
import ExoContext from "../../../common/ExoContext";
import EffortPrototype from "../domain/ems/effort/EffortPrototype";

export default class CreateEffortService implements CreateEffortUseCase {
	constructor(private ctx: ExoContext) {
	}

	async taskUnderArea(area: Area): Promise<Effort> {
		const title = this.ctx.utils.generateUid();
		const id = this.ctx.utils.generateUid();
		const effort = new Effort(id, title, EffortStatus.DRAFT, null, null, null, null, null, null, area, null, 0, [], "Body");

		await this.ctx.effortRepository.save(effort);

		return effort;
	}

	async taskUnderEffort(parentEffort: Effort): Promise<Effort> {
		const title = this.ctx.utils.generateUid();
		const id = this.ctx.utils.generateUid();
		const effort = new Effort(id, title, EffortStatus.DRAFT, null, null, null, null, null, null, null, parentEffort, 0, [], "Body");

		await this.ctx.effortRepository.save(effort);

		return effort;
	}

	async taskUnderPrototype(prototype: EffortPrototype): Promise<Effort> {
		const title = this.ctx.utils.generateUid();
		const id = this.ctx.utils.generateUid();
		const effort = new Effort(id, title, EffortStatus.DRAFT, null, null, null, null, null, prototype, null, null, 0, [], "Body");

		await this.ctx.effortRepository.save(effort);

		return effort;
	}
}
