import ExoCommand from "./ExoCommand";
import ExoContext from "../../../../../common/ExoContext";
import Effort from "../../../../../core/src/domain/ems/effort/Effort";

export default class EffortEndCommand implements ExoCommand {
	name: string = "End Effort";
	slug: string = "end-effort";

	constructor(private ctx: ExoContext) {
	}

	async execute(ctx: ExoContext): Promise<void> {
		let file = this.ctx.appUtils.getActiveFileOrThrow();
		let activeKo = await this.ctx.kObjectCreator.createFromTFileTyped(file);
		console.log(activeKo);
		if (!(activeKo instanceof Effort)) {
			throw new Error("Command can only be executed on Efforts, but active file has KOC " + activeKo.koc);
		}

		await this.ctx.effortEndUseCase.end(activeKo as Effort);
	}

}
