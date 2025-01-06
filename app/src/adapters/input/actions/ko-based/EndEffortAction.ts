import EffortAction from "./EffortAction";
import ExoContext from "../../../../../../common/ExoContext";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";

export default class EndEffortAction implements EffortAction {

	constructor(private ctx: ExoContext) {
	}

	async execute(effort: Effort): Promise<void> {
		await this.ctx.effortEndUseCase.end(effort);
	}

}
