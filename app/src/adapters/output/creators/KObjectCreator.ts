import {TFile} from "obsidian";
import KObject from "../../../../../core/src/domain/KObject";
import {KOC} from "../../../../../core/src/domain/KOC";
import {UUID} from "node:crypto";
import KOCFactory from "../../../utils/KOCFactory";
import ExoContext from "../../../../../common/ExoContext";

export default class KObjectCreator {
	constructor(private ctx: ExoContext) {
	}

	async createFromTFile(file: TFile) {
		const frontmatter = this.ctx.appUtils.getFrontmatterOrThrow(file);
		const id = frontmatter["uid"] as UUID;
		const koc = this.getFileKoc(file);
		const body = await this.ctx.appUtils.getFileBody(file);
		return new KObject(id, koc, file.basename, body);
	}

	async createFromFileTyped(file: TFile): Promise<KObject> {
		const koc = this.getFileKoc(file);
		switch (koc) {
			case KOC.EMS_AREA:
				return this.ctx.areaCreator.create(file);
			case KOC.EMS_EFFORT:
				return await this.ctx.effortCreator.create(file);
			case KOC.EMS_EFFORT_PROTOTYPE:
				return await this.ctx.effortPrototypeCreator.create(file);
			case KOC.EMS_BOARD:
				return await this.ctx.boardCreator.create(file);
			case KOC.TMS_DN:
				return this.ctx.dailyNoteCreator.create(file);
			case KOC.IMS_MOC:
				return this.ctx.mocCreator.create(file);
			case KOC.IMS_SIMULACRUM:
				return this.ctx.simulacrumCreator.create(file);
			case KOC.KMS_PROPERTY:
				return this.ctx.propertyCreator.create(file);
			case KOC.KMS_KOC:
				return this.ctx.kocObjectCreator.create(file);
			case KOC.UNKNOWN:
				return this.createFromTFile(file);
			default:
				throw new Error(`KOC '${koc}' not supported`);
		}
	}

	getFileKoc(file: TFile): KOC {
		const tags = this.ctx.appUtils.getTagsFromFile(file);
		return KOCFactory.getFromTags(tags);
	}
}
