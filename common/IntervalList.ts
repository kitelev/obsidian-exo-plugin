import Interval from "./Interval";

export default class IntervalList {

	public static readonly EMPTY = new IntervalList([]);

	constructor(private intervals: Interval[]) {
	}

	getTotalMinutes() {
		return this.intervals.reduce((acc, interval) => acc + interval.getTotalMinutes(), 0);
	}
}
