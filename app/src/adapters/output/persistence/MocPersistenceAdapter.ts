import MocRepository from "../../../../../core/src/ports/output/MocRepository";
import MOC from "../../../../../core/src/domain/ims/MOC";
import ExoContext from "../../../../../common/ExoContext";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";

export default class MocPersistenceAdapter extends AbstractPersistenceAdapter<MOC> implements MocRepository {
	constructor(ctx: ExoContext) {
		super(ctx, MOC.CLASS);
	}

	async findChildren(moc: MOC): Promise<MOC[]> {
		return await this.find(m => {
			if (m.parent === null) return false
			return m.parent.id === moc.id;
		});
	}
}
