import OpenRandomNoteExoCommand from "./OpenRandomNoteExoCommand";
import ExoCommand from "./ExoCommand";
import CountNotesExoCommand from "./utilities/CountNotesExoCommand";
import CreateEmptyNoteWithinInboxExoCommand from "./CreateEmptyNoteWithinInboxExoCommand";
import GetActiveFileTagsExoCommand from "./utilities/GetActiveFileTagsExoCommand";
import GetCurrentKOCExoCommand from "./utilities/GetCurrentKOCExoCommand";
import OpenCurrentDailyNoteExoCommand from "./OpenCurrentDailyNoteExoCommand";
import ExoContext from "../../../../../common/ExoContext";
import CreateEffortExoCommand from "./CreateEffortExoCommand";
import FindDuplicateIds from "./utilities/FindDuplicateIds";
import CountNotesWithoutId from "./utilities/CountNotesWithoutId";

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
			new FindDuplicateIds(ctx),
			new CountNotesWithoutId(ctx)
		];
	}
}
