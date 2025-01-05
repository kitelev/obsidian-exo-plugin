import {TFile} from "obsidian";
import ExoContext from "../../../../common/ExoContext";
import KObjectRepository from "../../../../core/src/ports/output/KObjectRepository";
import {KOC} from "../../../../core/src/domain/KOC";
import KObject from "../../../../core/src/domain/KObject";

export default class KObjectPersistenceAdapter implements KObjectRepository {
	constructor(private ctx: ExoContext) {
	}

	async findByKOC(koc: KOC): Promise<KObject[]> {
		const all = await this.findAll();
		return all.filter(ko => ko.koc === koc);
	}

	async findAll(): Promise<KObject[]> {
		const raw: TFile[] = this.ctx.appUtils.getAllNotes();
		return Promise.all(raw.map(async f => this.ctx.kObjectCreator.createFromTFile(f)));
	}
}
