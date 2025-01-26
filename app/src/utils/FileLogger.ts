import ExoContext from "../../../common/ExoContext";
import DateUtils from "../../../common/utils/DateUtils";

export class FileLogger {

	constructor(private ctx: ExoContext, private logsFolderPath: string) {
	}

	async logMsg(message: string) {
		await this.ctx.appUtils.createFolderIfNotExists(this.logsFolderPath);

		const filePath = `${this.logsFolderPath}/Logs-${DateUtils.formatLocalDate(new Date())}.md`;
		await this.ctx.appUtils.createFileIfNotExists(filePath);

		await this.ctx.appUtils.appendToFile(filePath, message);
	}

	async logError(error: Error) {
		const timestamp = DateUtils.formatZdtWithUTC(new Date());
		const stack = error.stack ?? "Stack trace unavailable";
		const msg = `\n\`\`\`\n${timestamp}\n${stack}\n\`\`\`\n`;
		await this.logMsg(msg);
	}
}
