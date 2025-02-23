import ExoContext from "../../../common/ExoContext";
import CreateAreaUseCase, {CreateAreaCommand} from "../ports/input/CreateAreaUseCase";
import Area from "../domain/ems/Area";

export default class CreateAreaService implements CreateAreaUseCase {
	constructor(private ctx: ExoContext) {
	}

	async create(cmd: CreateAreaCommand): Promise<Area> {
		const id = this.ctx.utils.generateUid();
		const title = `(A) ${cmd.title}`;
		const area = new Area(id, title, "", cmd.parent ?? null);

		await this.ctx.areaRepository.save(area);

		return area;
	}
}
