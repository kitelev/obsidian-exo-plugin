import ExoContext from "../../../common/ExoContext";
import DateUtils from "../../../common/utils/DateUtils";

export class FileLogger {

	constructor(private ctx: ExoContext, private logsFolderPath: string) {
	}

	async log(message: string) {
		const filePath = await this.prepareLogFile();
		await this.ctx.appUtils.appendToFile(filePath, message);
	}

	private async prepareLogFile() {
		await this.ctx.appUtils.createFolderIfNotExists(this.logsFolderPath);

		const filePath = `${this.logsFolderPath}/Logs-${DateUtils.formatLocalDate(new Date())}.md`;
		await this.ctx.appUtils.createFileIfNotExists(filePath);
		return filePath;
	}
}
