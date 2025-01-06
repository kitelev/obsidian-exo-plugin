import Effort from "../domain/ems/effort/Effort";
import ExoContext from "../../../common/ExoContext";
import EffortEndUseCase from "../ports/input/EffortEndUseCase";

export default class EffortEndService implements EffortEndUseCase {

	constructor(private ctx: ExoContext) {
	}

	async end(effort: Effort): Promise<void> {
		effort.end();

		await this.ctx.effortRepository.update(effort);
	}

}
