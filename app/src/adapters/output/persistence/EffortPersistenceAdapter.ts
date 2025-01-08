import EffortRepository from "../../../../../core/src/ports/output/EffortRepository";
import Effort from "../../../../../core/src/domain/ems/effort/Effort";
import ExoContext from "../../../../../common/ExoContext";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";
import EffortSerde from "../serde/EffortSerde";

export default class EffortPersistenceAdapter extends AbstractPersistenceAdapter<Effort> implements EffortRepository {
	constructor(ctx: ExoContext) {
		super(ctx, Effort.CLASS);
	}

	protected serializeKoSpecificProps(effort: Effort): string {
		return new EffortSerde(this.ctx).serializeKoSpecificProps(effort);
	}
}
