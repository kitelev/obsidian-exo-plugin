import ExoContext from "../../../../../../../common/ExoContext";
import AbstractExoAction from "../../AbstractExoAction";

export default class CacheDrop extends AbstractExoAction {
	name = "Cache Drop";

	constructor(private ctx: ExoContext) {
		super();
	}

	async execute(): Promise<void> {
		this.ctx.effortCache.clear();
		console.debug("Cache dropped");
	}
}
