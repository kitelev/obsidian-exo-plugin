export default class Interval {
	constructor(public readonly start: Date,
				public readonly end: Date) {
	}

	getTotalMinutes() {
		return (this.end.getTime() - this.start.getTime()) / 1000 / 60;
	}
}
