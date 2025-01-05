import ExoCommand from "../ExoCommand";
import ExoContext from "../../../../../../common/ExoContext";

export default class DropRedundantDataviewJsLayoutScriptCommand implements ExoCommand {
	name: string = "DropRedundantDataviewJsLayoutScriptCommand";
	slug: string = "drop-redundant-dataview-js-layout-script";

	constructor(private ctx: ExoContext) {
	}

	async execute(ctx: ExoContext): Promise<void> {
		// Получаем список всех заметок
		let files = this.ctx.appUtils.getAllNotes();

		// Определяем регулярное выражение для удаления нужного фрагмента
		const regex = /```dataviewjs\s*const { ModulesFactory } = await self\.require\.import\("\[\[ModulesFactory\.ts\]\]"\);\s*const factory = new ModulesFactory\(dv, this\.app, this\);\s*const layoutManager = await factory\.layoutManager\(\);\s*layoutManager\.universalLayout\(\);\s*```/g;

		console.log(`Found ${files.length} files`);

		let idx = 0;
		for (let file of files) {
			let newData = await this.ctx.appUtils.getFileBody(file);

			console.log(`Processing file ${++idx}/${files.length}: ${file.path}`);

			if (regex.test(newData)) {
				console.log(`Found redundant dataviewjs layout script in ${file.path}`);
				newData = newData.replace(regex, "");
				await this.ctx.appUtils.updateFile(file, newData);
			}
			if (idx % 50 === 0) {
				console.log(`Processed ${idx}/${files.length} files`);
			}
		}
	}
}
