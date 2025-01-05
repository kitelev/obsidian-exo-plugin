import {TFile} from "obsidian";
import ExoContext from "../../../../common/ExoContext";
import Area from "../../../../core/src/domain/ems/Area";
import AreaRepository from "../../../../core/src/ports/output/AreaRepository";
import {KOC} from "../../../../core/src/domain/KOC";

export default class AreaPersistenceAdapter implements AreaRepository {
	constructor(private ctx: ExoContext) {
	}

	async findChildren(parent: Area): Promise<Area[]> {
		const all = await this.findAll();

		return all.filter(a => {
			if (a.parent === null) return false
			return a.parent.id === parent.id;
		});
	}

	async findAll(): Promise<Area[]> {
		const files: TFile[] = this.ctx.appUtils.findMdWith((f: TFile) => {
			return this.ctx.appUtils.getTagsFromFile(f).some(t => t.contains(KOC.EMS_AREA));
		});

		return Promise.all(files.map(async f => await this.ctx.areaCreator.create(f)));
	}
}
