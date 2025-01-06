import {Notice, TFile} from "obsidian";
import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class OpenRandomNote extends AbstractExoAction {
	name = "Open Random Note";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		let randomNote = this.getRandomNote();
		if (randomNote === null) {
			new Notice("No old notes found");
			return;
		}

		await this.ctx.appUtils.openFile(randomNote);
	}

	private getRandomNote(): TFile | null {
		const today = new Date();
		const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).setHours(0, 0, 0, 0); // Дата месяц назад без времени

		const oldNotes = this.ctx.appUtils.findNotes(file => file.stat.mtime < lastMonth);
		if (oldNotes.length === 0) {
			return null;
		}

		return oldNotes[Math.floor(Math.random() * oldNotes.length)];
	}
}
