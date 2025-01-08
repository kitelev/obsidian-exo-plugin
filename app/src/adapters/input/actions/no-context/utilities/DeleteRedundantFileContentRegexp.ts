import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class DeleteRedundantFileContentRegexp extends AbstractExoAction {
	name: string = "Delete Redundant File Content Regexp";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(ctx: ExoContext): Promise<void> {
		// Получаем список всех заметок
		let files = this.ctx.appUtils.getAllNotes();

		// Определяем регулярное выражение для удаления нужного фрагмента
		const regex = /this is text to delete/g;

		console.debug(`Found ${files.length} files`);

		let idx = 0;
		for (let file of files) {
			console.debug(`Processing file ${++idx}/${files.length}: ${file.path}`);
			let newData = await this.ctx.appUtils.getFileContent(file);

			if (regex.test(newData)) {
				console.debug(`Found text to delete in ${file.path}`);
				newData = newData.replace(regex, "");
				await this.ctx.appUtils.updateFile(file, newData);
			}
			if (idx % 50 === 0) {
				console.debug(`Processed ${idx}/${files.length} files`);
			}
		}
	}
}
