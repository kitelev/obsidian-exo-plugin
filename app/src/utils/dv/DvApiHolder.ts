import {DataviewApi} from "api/plugin-api";
import {getAPI} from "index";
import ExoContext from "../../../../common/ExoContext";

export default class DvApiHolder {
	public dvApi: DataviewApi;

	constructor(ctx: ExoContext) {
		const dvApi: DataviewApi | undefined = getAPI(ctx.app);
		if (!dvApi) {
			throw new Error('Dataview API not available.');
		}
		this.dvApi = dvApi;
	}
}
