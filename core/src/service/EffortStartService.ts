import Effort from "../domain/ems/effort/Effort";
import EffortStartUseCase from "../ports/input/EffortStartUseCase";
import ExoContext from "../../../common/ExoContext";

export default class EffortStartService implements EffortStartUseCase {

	constructor(private ctx: ExoContext) {
	}

	async start(effort: Effort): Promise<void> {
		effort.start();

		await this.ctx.effortRepository.update(effort);
	}

}
