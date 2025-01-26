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

	static dayBefore(d1: Date, d2: Date): boolean {
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
		return d1Copy.getTime() < d2Copy.getTime();
	}

	/**
	 * Returns true if d1 is the same day or before d2
	 */
	static sameDayOrBefore(d1: Date, d2: Date): boolean {
		return this.sameDay(d1, d2) || this.dayBefore(d1, d2);
	}

	static formatTimestamp(date: Date): string {
		return `${this.formatLocalDate(date)} ${this.formatLocalTime(date)}`;
	}

	static formatZdtWithUTC(date: Date): string {
		return date.toISOString();
	}

	static formatLocalDate(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	}

	static formatLocalTime(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}

	/**
	 * Format a time period in the format "??d ??h ??m"
	 * if 0 days, it will be omitted
	 */
	static formatTimePeriodFromMinutes(periodInMins: number): string {
		const days = Math.floor(periodInMins / (60 * 24));
		const hours = Math.floor(periodInMins / (60)) % 24;
		const minutes = Math.floor(periodInMins) % 60;
		const parts = [];
		if (days > 0) {
			parts.push(`${days}d`);
		}
		if (hours > 0) {
			parts.push(`${hours}h`);
		}
		if (minutes > 0) {
			parts.push(`${minutes}m`);
		}
		return parts.join(' ');
	}
}
