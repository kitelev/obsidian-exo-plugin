import OpenRandomNote from "./utilities/OpenRandomNote";
import ExoAction from "./ExoAction";
import CreateEmptyNoteWithinInbox from "./utilities/CreateEmptyNoteWithinInbox";
import GetActiveFileTags from "./utilities/GetActiveFileTags";
import GetCurrentKOC from "./utilities/GetCurrentKOC";
import OpenCurrentDailyNoteExoCommand from "./domain/OpenCurrentDailyNoteExoCommand";
import ExoContext from "../../../../../../common/ExoContext";
import CreateEffort from "./domain/CreateEffort";
import FindDuplicateIds from "./utilities/FindDuplicateIds";
import CountNotesWithoutId from "./utilities/CountNotesWithoutId";
import CountNotes from "./utilities/CountNotes";
import FindNotesWithoutFrontmatter from "./utilities/FindNotesWithoutFrontmatter";
import AddMissingFrontmatter from "./utilities/AddMissingFrontmatter";
import AddMissingUid from "./utilities/AddMissingUid";
import DeleteRedundantFileContentRegexp from "./utilities/DeleteRedundantFileContentRegexp";

export default class ExoActions {
	static all(ctx: ExoContext): ExoAction[] {
		return [
			new OpenCurrentDailyNoteExoCommand(ctx),
			new CreateEmptyNoteWithinInbox(ctx),
			new CreateEffort(ctx),
			new OpenRandomNote(ctx),
			new CountNotes(ctx),
			new CountNotesWithoutId(ctx),
			new FindDuplicateIds(ctx),
			new FindNotesWithoutFrontmatter(ctx),
			new AddMissingFrontmatter(ctx),
			new AddMissingUid(ctx),
			new DeleteRedundantFileContentRegexp(ctx),
			new GetCurrentKOC(ctx),
			new GetActiveFileTags(ctx)
		];
	}
}
