import ExoContext from "../../../../../common/ExoContext";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";
import EffortPrototype from "../../../../../core/src/domain/ems/effort/EffortPrototype";
import EffortPrototypeRepository from "../../../../../core/src/ports/output/EffortPrototypeRepository";
import EffortPrototypeSerde from "../serde/EffortPrototypeSerde";
import Area from "../../../../../core/src/domain/ems/Area";

export default class EffortPrototypePersistenceAdapter extends AbstractPersistenceAdapter<EffortPrototype> implements EffortPrototypeRepository {
	constructor(ctx: ExoContext) {
		super(ctx, EffortPrototype.CLASS);
	}

	async findByArea(ko: Area): Promise<EffortPrototype[]> {
		return await this.find(effortPrototype => effortPrototype.area?.id === ko.id);
	}

	protected serializeKoSpecificProps(effortPrototype: EffortPrototype): string {
		return new EffortPrototypeSerde(this.ctx).serializeKoSpecificProps(effortPrototype);
	}
}
