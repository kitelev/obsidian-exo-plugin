import Effort from "./Effort";

export default class EffortQuery<T> {

	public static TIME_SPENT = new EffortQuery<number>("Time Spent",
		effort => {
			if (!effort.started) {
				return 0;
			}

			const minutesFromStart = (new Date().getTime() - effort.started.getTime()) / 1000 / 60;
			return minutesFromStart - effort.getHoldsHistory().getTotalMinutes();
		}
	);

	constructor(public readonly name: string,
				public readonly executeFunction: (e: Effort, params?: Record<string, any>) => T) {
	}
}
