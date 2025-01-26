import {Runnable, RunnableAsync} from "../../../common/fp/Runnable";
import {Notice} from "obsidian";
import ExoContext from "../../../common/ExoContext";

export default class UserFriendly {
    constructor(private ctx: ExoContext) {
    }

    async call(runnable: Runnable) {
        try {
            runnable();
        } catch (e) {
            await this.handleError(e);
        }
    }

    async callAsync(runnable: RunnableAsync): Promise<void> {
        try {
            await runnable();
        } catch (e) {
            await this.handleError(e);
        }
    }

    private async handleError(e: Error) {
        console.error(e);
        new Notice(`Error: ${e.message}`);
        await this.ctx.fileLogger.logError(e);
    }
}
