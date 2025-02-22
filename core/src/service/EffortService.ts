import Effort from "../domain/ems/effort/Effort";
import ExoContext from "../../../common/ExoContext";
import EffortUseCases from "../ports/input/EffortUseCases";

export default class EffortService implements EffortUseCases {

	constructor(private ctx: ExoContext) {
	}

	async start(effort: Effort): Promise<void> {
		effort.start();
		await this.persist(effort);
	}

	async hold(effort: Effort): Promise<void> {
		const holdDate = this.ctx.dateSupplier.get();
		effort.hold(holdDate);
		await this.persist(effort);
	}

	async resume(effort: Effort): Promise<void> {
		const resumeDate = this.ctx.dateSupplier.get();
		effort.resume(resumeDate);
		await this.persist(effort);
	}

	async end(effort: Effort): Promise<void> {
		effort.end();
		await this.persist(effort);
	}

	private async persist(effort: Effort) {
		await this.ctx.effortRepository.update(effort);
	}
}
