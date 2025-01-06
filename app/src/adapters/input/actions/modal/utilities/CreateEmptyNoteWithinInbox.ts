import ExoAction from "../ExoAction";
import ExoContext from "../../../../../../../common/ExoContext";
import Constants from "../../../../../utils/Constants";
import SingleInputModal from "../../../../../SingleInputModal";

export default class CreateEmptyNoteWithinInbox implements ExoAction {
	name = "Create Empty Note Within Inbox";

	constructor(private ctx: ExoContext) {
	}

	async execute() {
		const callback: (title: string) => Promise<void> = async (title) => {
			const file = await this.createNote(title);
			await this.ctx.appUtils.openFile(file);
		};

		new SingleInputModal(this.ctx, callback).open();
	}

	private async createNote(title: string) {
		const path = `${Constants.INBOX_FOLDER_PATH}/${title}.md`;
		const content = `---\nuid: ${this.ctx.utils.generateUid()}\n---`;
		return await this.ctx.appUtils.createFile(path, content);
	}
}
