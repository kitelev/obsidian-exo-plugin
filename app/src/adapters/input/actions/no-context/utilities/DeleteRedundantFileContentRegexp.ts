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

		console.log(`Found ${files.length} files`);

		let idx = 0;
		for (let file of files) {
			let newData = await this.ctx.appUtils.getFileContent(file);

			console.log(`Processing file ${++idx}/${files.length}: ${file.path}`);

			if (regex.test(newData)) {
				console.log(`Found text to delete in ${file.path}`);
				newData = newData.replace(regex, "");
				await this.ctx.appUtils.updateFile(file, newData);
			}
			if (idx % 50 === 0) {
				console.log(`Processed ${idx}/${files.length} files`);
			}
		}
	}
}