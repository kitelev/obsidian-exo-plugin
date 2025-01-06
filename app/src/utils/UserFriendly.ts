import {Runnable, RunnableAsync} from "../../../common/fp/Runnable";
import {Notice} from "obsidian";

export default class UserFriendly {
	static call(runnable: Runnable): void {
		try {
			runnable();
		} catch (e) {
			this.handleError(e);
		}
	}

	static async callAsync(runnable: RunnableAsync): Promise<void> {
		try {
			await runnable();
		} catch (e) {
			this.handleError(e);
		}
	}

	static handleErrorMsg(msg: string) {
		console.error(msg);
		new Notice(`Error: ${msg}`);
	}

	private static handleError(e: Error) {
		console.error(e);
		new Notice(`Error: ${e.message}`);
	}
}
