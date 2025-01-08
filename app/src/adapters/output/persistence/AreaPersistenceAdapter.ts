import ExoContext from "../../../../../common/ExoContext";
import Area from "../../../../../core/src/domain/ems/Area";
import AreaRepository from "../../../../../core/src/ports/output/AreaRepository";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";

export default class AreaPersistenceAdapter extends AbstractPersistenceAdapter<Area> implements AreaRepository {
	constructor(ctx: ExoContext) {
		super(ctx, Area.CLASS);
	}

	async findChildren(parent: Area): Promise<Area[]> {
		return await this.find(a => {
			if (!a.parent) return false
			return a.parent.id === parent.id;
		});
	}
}