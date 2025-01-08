import EffortRepository from "../../../../core/src/ports/output/EffortRepository";
import Effort from "../../../../core/src/domain/ems/effort/Effort";
import ExoContext from "../../../../common/ExoContext";
import DateUtils from "../../../../common/utils/DateUtils";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";

export default class EffortPersistenceAdapter extends AbstractPersistenceAdapter<Effort> implements EffortRepository {
	constructor(ctx: ExoContext) {
		super(ctx, Effort.CLASS);
	}

	protected serializeKoSpecificProps(effort: Effort): string {
		let result = "";
		result += "e-status: " + effort.status + "\n";
		if (effort.started) {
			result += "started: " + DateUtils.formatTimestamp(effort.started) + "\n";
		}
		if (effort.ended) {
			result += "ended: " + DateUtils.formatTimestamp(effort.ended) + "\n";
		}
		if (effort.prototype) {
			result += "e-prototype: \'" + this.getLinkToKO(effort.prototype) + "\'\n";
		}
		if (effort.area) {
			result += "area: \'" + this.getLinkToKO(effort.area) + "\'\n";
		}
		if (effort.parent) {
			result += "e-parent: \'" + this.getLinkToKO(effort.parent) + "\'\n";
		}
		return result;
	}
}
