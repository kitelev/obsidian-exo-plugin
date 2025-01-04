export default class DateUtils {
	static sameDay(d1: Date, d2: Date): boolean {
		return d1.setHours(0, 0, 0, 0) === d2.setHours(0, 0, 0, 0);
	}
}
