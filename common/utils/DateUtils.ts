export default class DateUtils {
	static sameDay(d1: Date, d2: Date): boolean {
		return d1.setHours(0, 0, 0, 0) === d2.setHours(0, 0, 0, 0);
	}

	static formatDate(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}
}