import Effort from "../domain/ems/effort/Effort";
import ExoContext from "../../../common/ExoContext";
import EffortUseCases from "../ports/input/EffortUseCases";
import EffortAction from "../domain/ems/effort/EffortAction";

export default class EffortService implements EffortUseCases {

	constructor(private ctx: ExoContext) {
	}

	async execute(effort: Effort, action: EffortAction): Promise<void> {
		action.executeFunction(effort);

		await this.ctx.effortRepository.update(effort);
	}
}
