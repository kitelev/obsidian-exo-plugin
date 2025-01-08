import MOC from "../../../../../core/src/domain/ims/MOC";
import ExoContext from "../../../../../common/ExoContext";
import Simulacrum from "../../../../../core/src/domain/ims/Simulacrum";
import SimulacrumRepository from "../../../../../core/src/ports/output/SimulacrumRepository";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";

export default class SimulacrumPersistenceAdapter extends AbstractPersistenceAdapter<Simulacrum> implements SimulacrumRepository {
	constructor(ctx: ExoContext) {
		super(ctx, Simulacrum.CLASS);
	}

	async findByMOC(moc: MOC): Promise<Simulacrum[]> {
		return await this.find(s => {
			return s.moc.id === moc.id;
		});
	}
}
