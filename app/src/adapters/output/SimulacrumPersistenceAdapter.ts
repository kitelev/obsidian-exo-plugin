import {TFile} from "obsidian";
import MOC from "../../../../core/src/domain/ims/MOC";
import ExoContext from "../../../../common/ExoContext";
import Simulacrum from "../../../../core/src/domain/ims/Simulacrum";
import SimulacrumRepository from "../../../../core/src/ports/output/SimulacrumRepository";
import {KOC} from "../../../../core/src/domain/KOC";

export default class SimulacrumPersistenceAdapter implements SimulacrumRepository {
	constructor(private ctx: ExoContext) {
	}

	async findByMOC(moc: MOC): Promise<Simulacrum[]> {
		const all = await this.findAll();

		return all.filter(s => {
			return s.moc.id === moc.id;
		});
	}

	async findAll(): Promise<Simulacrum[]> {
		const rawMOCs: TFile[] = this.ctx.appUtils.findNotes((f: TFile) => {
			return this.ctx.appUtils.getTagsFromFile(f).contains(KOC.IMS_SIMULACRUM);
		});

		return Promise.all(rawMOCs.map(async f => await this.ctx.simulacrumCreator.create(f)));
	}
}
