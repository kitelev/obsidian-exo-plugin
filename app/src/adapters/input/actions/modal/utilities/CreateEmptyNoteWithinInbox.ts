import ExoAction from "../ExoAction";
import ExoContext from "../../../../../../../common/ExoContext";
import Constants from "../../../../../utils/Constants";
import SingleInputModal from "../../../../../SingleInputModal";
import {BiConsumerAsync} from "../../../../../../../common/fp/Consumer";
import {TFile} from "obsidian";
import {KOC} from "../../../../../../../core/src/domain/KOC";
import KObject from "../../../../../../../core/src/domain/KObject";

export default class CreateEmptyNoteWithinInbox implements ExoAction {
	name = "Create Empty Note Within Inbox";

	constructor(private ctx: ExoContext) {
	}

	async execute() {
		const callback: BiConsumerAsync<string, KOC> = async (title, koc) => {
			const file = await this.createNote(title, koc);
			await this.ctx.appUtils.openFile(file);
		};

		new SingleInputModal(this.ctx, callback).open();
	}

	private async createNote(title: string, koc: KOC): Promise<TFile> {
		const path = `${Constants.INBOX_FOLDER_PATH}/${title}.md`;
		const ko = new KObject(this.ctx.utils.generateUid(), koc);
		const content = this.serialize(ko);
		return await this.ctx.appUtils.createFile(path, content);
	}

	private serialize(ko: KObject) {
		let result = "";
		result += "---\n";
		result += "tags:\n";
		result += ` - ${ko.koc}\n`;
		result += "uid: " + ko.id + "\n";
		result += "---\n";
		return result;
	}
}
