import ExoAction from "../ExoAction";
import ExoContext from "../../../../../../../common/ExoContext";

export default class CreateEmptyNoteWithinInbox implements ExoAction {
	name = "Create Effort Within Inbox";

	constructor(private ctx: ExoContext) {
	}

	async execute() {
		const uid = this.ctx.utils.generateUid();
		const path = `/0 Inbox/${uid}.md`;
		await this.ctx.appUtils.createFile(path, uid);
	}
}
