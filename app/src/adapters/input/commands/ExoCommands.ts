import OpenRandomNoteExoCommand from "./OpenRandomNoteExoCommand";
import ExoCommand from "./ExoCommand";
import CreateEmptyNoteWithinInboxExoCommand from "./CreateEmptyNoteWithinInboxExoCommand";
import GetActiveFileTagsExoCommand from "./utilities/GetActiveFileTagsExoCommand";
import GetCurrentKOCExoCommand from "./utilities/GetCurrentKOCExoCommand";
import OpenCurrentDailyNoteExoCommand from "./OpenCurrentDailyNoteExoCommand";
import ExoContext from "../../../../../common/ExoContext";
import CreateEffortExoCommand from "./CreateEffortExoCommand";
import FindDuplicateIds from "./utilities/FindDuplicateIds";
import CountNotesWithoutId from "./utilities/CountNotesWithoutId";
import CountNotesExoCommand from "./utilities/CountNotesExoCommand";
import FindNotesWithoutFrontmatter from "./utilities/FindNotesWithoutFrontmatter";
import AddMissingFrontmatterCommand from "./utilities/AddMissingFrontmatterCommand";
import AddMissingUidCommand from "./utilities/AddMissingUidCommand";
import DropRedundantDataviewJsLayoutScriptCommand from "./utilities/DropRedundantDataviewJsLayoutScriptCommand";

export default class ExoCommands {
	static all(ctx: ExoContext): ExoCommand[] {
		return [
			new OpenRandomNoteExoCommand(ctx),
			new CreateEmptyNoteWithinInboxExoCommand(ctx),
			new GetActiveFileTagsExoCommand(ctx),
			new GetCurrentKOCExoCommand(ctx),

			new OpenCurrentDailyNoteExoCommand(ctx, ctx.getCurrentDNUseCase),

			new CreateEffortExoCommand(ctx),

			new FindDuplicateIds(ctx),
			new CountNotesWithoutId(ctx),
			new CountNotesExoCommand(ctx),
			new FindNotesWithoutFrontmatter(ctx),
			new AddMissingFrontmatterCommand(ctx),
			new AddMissingUidCommand(ctx),
			new DropRedundantDataviewJsLayoutScriptCommand(ctx)
		];
	}
}
