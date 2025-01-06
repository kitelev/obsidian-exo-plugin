import EffortCommand from "./EffortCommand";
import ExoContext from "../../../../../../common/ExoContext";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";

export default class EndEffortCommand implements EffortCommand {

	constructor(private ctx: ExoContext) {
	}

	async execute(effort: Effort): Promise<void> {
		await this.ctx.effortEndUseCase.end(effort);
	}

}
