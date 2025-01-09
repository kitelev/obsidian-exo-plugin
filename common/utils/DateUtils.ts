export default class DateUtils {
	static sameDay(d1: Date, d2: Date): boolean {
		if (!d1) {
			throw new Error('d1 is required');
		}
		if (!d2) {
			throw new Error('d2 is required');
		}
		const d1Copy = new Date(d1);
		const d2Copy = new Date(d2);
		d1Copy.setHours(0, 0, 0, 0);
		d2Copy.setHours(0, 0, 0, 0);
		return d1Copy.getTime() === d2Copy.getTime();
	}

	static formatTimestamp(date: Date): string {
		return `${this.formatLocalDate(date)} ${this.formatLocalTime(date)}`;
	}

	static formatLocalDate(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	}

	static formatLocalTime(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}
}
