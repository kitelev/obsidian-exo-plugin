import {Notice} from "obsidian";
import ExoContext from "../../../common/ExoContext";
import DateUtils from "../../../common/utils/DateUtils";

export default class LoggingFacade {
	constructor(private ctx: ExoContext) {
	}

	async logMsg(msg: string) {
		new Notice(msg);
		console.log(msg);

		const timestamp = DateUtils.formatZdtWithUTC(new Date());
		const message = `\n\`\`\`\n${timestamp}\n${msg}\n\`\`\`\n`;
		await this.ctx.fileLogger.log(message);
	}

	async logError(e: Error) {
		new Notice(`Error: ${e.message}`);
		console.error(e);

		const timestamp = DateUtils.formatZdtWithUTC(new Date());
		const stack = e.stack ?? "Stack trace unavailable";
		const msg = `\n\`\`\`\n${timestamp}\n${stack}\n\`\`\`\n`;
		await this.ctx.fileLogger.log(msg);
	}
}
