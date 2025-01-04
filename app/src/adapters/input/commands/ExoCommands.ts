import OpenRandomNoteExoCommand from "./OpenRandomNoteExoCommand";
import ExoCommand from "./ExoCommand";
import CountNotesExoCommand from "./CountNotesExoCommand";
import CreateEmptyNoteWithinInboxExoCommand from "./CreateEmptyNoteWithinInboxExoCommand";
import GetActiveFileTagsExoCommand from "./GetActiveFileTagsExoCommand";
import GetCurrentKOCExoCommand from "./GetCurrentKOCExoCommand";
import OpenCurrentDailyNoteExoCommand from "./OpenCurrentDailyNoteExoCommand";
import ExoContext from "../../../../../common/ExoContext";
import CreateEffortExoCommand from "./CreateEffortExoCommand";
import FindDuplicateIds from "./FindDuplicateIds";

export default class ExoCommands {
	static all(ctx: ExoContext): ExoCommand[] {
		return [
			new OpenRandomNoteExoCommand(),
			new CountNotesExoCommand(ctx.countNotesUseCase),
			new CreateEmptyNoteWithinInboxExoCommand(ctx),
			new GetActiveFileTagsExoCommand(ctx),
			new GetCurrentKOCExoCommand(ctx),
			new OpenCurrentDailyNoteExoCommand(ctx, ctx.getCurrentDNUseCase),
			new CreateEffortExoCommand(ctx),
			new FindDuplicateIds(ctx)
		];
	}
}
