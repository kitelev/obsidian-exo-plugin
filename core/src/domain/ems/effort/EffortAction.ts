import Effort from "./Effort";
import {EffortStatus} from "./EffortStatus";
import {Consumer} from "../../../../../common/fp/Consumer";


export default class EffortAction {

	public static START = new EffortAction("Start",
		effort => {
			const expectedStatuses = [EffortStatus.DRAFT, EffortStatus.READY, EffortStatus.BACKLOG];
			if (expectedStatuses.indexOf(effort.status) === -1) {
				throw new Error("Effort must be in DRAFT, READY or BACKLOG status to be started");
			}
		},
		effort => {
			effort.start()
		}
	);

	public static HOLD = new EffortAction("Hold",
		effort => {
			if (effort.status !== EffortStatus.STARTED) {
				throw new Error("Effort must be started to be put on hold");
			}
		},
		effort => {
			effort.hold(new Date());
		}
	);

	public static RESUME = new EffortAction("Resume",
		effort => {
			if (effort.status !== EffortStatus.HOLD) {
				throw new Error("Effort must be on hold to be resumed");
			}
		},
		effort => {
			effort.resume(new Date());
		}
	);

	public static COMPLETE = new EffortAction("Complete",
		effort => {
			if (effort.status !== EffortStatus.STARTED) {
				throw new Error("Effort must be started to be ended");
			}
		},
		effort => {
			effort.end();
		}
	);

	public static VOTE = new EffortAction("Vote",
		effort => {
			if (effort.status === EffortStatus.ENDED) {
				throw new Error("Effort must not be ended to be voted on");
			}
		},
		effort => {
			effort.vote();
		}
	);

	public static readonly ALL: EffortAction[] = [
		EffortAction.START,
		EffortAction.HOLD,
		EffortAction.RESUME,
		EffortAction.COMPLETE,
		EffortAction.VOTE
	];

	constructor(public readonly name: string,
				public readonly assertFunction: Consumer<Effort>,
				public readonly executeFunction: (e: Effort, params: Record<string, any>) => void) {
	}

	public availableFor(effort: Effort): boolean {
		try {
			this.assertFunction(effort);
			return true;
		} catch (e) {
			return false;
		}
	}
}
