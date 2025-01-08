import ExoContext from "../../../../common/ExoContext";
import KObjectRepository from "../../../../core/src/ports/output/KObjectRepository";
import KObject from "../../../../core/src/domain/KObject";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";

export default class KObjectPersistenceAdapter extends AbstractPersistenceAdapter<KObject> implements KObjectRepository {
	constructor(ctx: ExoContext) {
		super(ctx);
	}
}
