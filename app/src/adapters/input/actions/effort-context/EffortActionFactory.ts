import ExoContext from "../../../../../../common/ExoContext";
import StartEffortAction from "./StartEffortAction";
import EndEffortAction from "./EndEffortAction";

export default class EffortActionFactory {
	constructor(private ctx: ExoContext) {
	}

	createStartEffortCommand() {
		return new StartEffortAction(this.ctx);
	}

	createEndEffortCommand() {
		return new EndEffortAction(this.ctx);
	}
}
