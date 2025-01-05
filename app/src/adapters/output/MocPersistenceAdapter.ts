import {TFile} from "obsidian";
import MocRepository from "../../../../core/src/ports/output/MocRepository";
import MOC from "../../../../core/src/domain/ims/MOC";
import ExoContext from "../../../../common/ExoContext";

export default class MocPersistenceAdapter implements MocRepository {
	constructor(private ctx: ExoContext) {
	}

	async findChildren(moc: MOC): Promise<MOC[]> {
		const allMOCs = await this.findAll();

		return allMOCs.filter(m => {
			if (m.parent === null) return false
			return m.parent.id === moc.id;
		});
	}

	async findAll(): Promise<MOC[]> {
		const rawMOCs: TFile[] = this.ctx.appUtils.findMdWith((f: TFile) => {
			return this.ctx.appUtils.getTagsFromFile(f).contains("IMS/MOC");
		});

		return Promise.all(rawMOCs.map(async f => await this.ctx.mocCreator.create(f)));
	}
}
