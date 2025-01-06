import ExoContext from "../../../../../../common/ExoContext";
import StartEffortCommand from "./StartEffortCommand";
import EndEffortCommand from "./EndEffortCommand";

export default class EffortCommandFactory {
	constructor(private ctx: ExoContext) {
	}

	createStartEffortCommand() {
		return new StartEffortCommand(this.ctx);
	}

	createEndEffortCommand() {
		return new EndEffortCommand(this.ctx);
	}
}
