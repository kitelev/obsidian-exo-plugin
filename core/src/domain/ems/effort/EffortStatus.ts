import Effort from "./Effort";

export enum EffortStatus {
	DRAFT = "DRAFT",
	BACKLOG = "BACKLOG",
	READY = "READY",
	PLANNED = "PLANNED",
	TUPLYU = "TUPLYU",
	STARTED = "STARTED",
	WAITING = "WAITING",
	ENDED = "ENDED",
	TRASHED = "TRASHED"
}

export class EffortStatusComparator {
	private static statusOrder: Record<string, number> = {
		"DRAFT": 1,
		"BACKLOG": 2,
		"READY": 3,
		"PLANNED": 4,
		"TUPLYU": 5,
		"STARTED": 6,
		"ENDED": 7,
		"TRASHED": 8
	};

	static compare(e1: Effort, e2: Effort): number {
		return (EffortStatusComparator.statusOrder[e2.status] || 99) - (EffortStatusComparator.statusOrder[e1.status] || 99);
	}
}
