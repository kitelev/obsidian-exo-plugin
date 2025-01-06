import ExoContext from "../../../../../../../common/ExoContext";
import Constants from "../../../../../utils/Constants";
import InputAndSelectKOCModal from "../../../../../utils/modal/forms/InputAndSelectKOCModal";
import {BiConsumerAsync} from "../../../../../../../common/fp/Consumer";
import {TFile} from "obsidian";
import {KOC} from "../../../../../../../core/src/domain/KOC";
import KObject from "../../../../../../../core/src/domain/KObject";
import AbstractExoAction from "../../AbstractExoAction";

export default class CreateEmptyNoteWithinInbox extends AbstractExoAction {
	name = "Create Empty Note Within Inbox";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute() {
		const callback: BiConsumerAsync<string, KOC> = async (title, koc) => {
			const file = await this.createNote(title, koc);
			await this.ctx.appUtils.openFile(file);
		};

		new InputAndSelectKOCModal(this.ctx, callback).open();
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
