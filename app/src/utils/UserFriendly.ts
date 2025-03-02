import {Runnable, RunnableAsync} from "../../../common/fp/Runnable";
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

	wrapAsyncFn(runnable: RunnableAsync): RunnableAsync {
		return async () => {
			await this.callAsync(runnable);
		};
	}

    private async handleError(e: Error) {
		await this.ctx.loggingFacade.logError(e);
    }
}
