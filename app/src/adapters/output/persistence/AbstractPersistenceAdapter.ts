import ExoContext from "../../../../../common/ExoContext";
import {KOC} from "../../../../../core/src/domain/KOC";
import KObject from "../../../../../core/src/domain/KObject";
import {TFile} from "obsidian";
import {UUID} from "node:crypto";
import GenericRepository from "../../../../../core/src/ports/output/GenericRepository";

export default abstract class AbstractPersistenceAdapter<KO extends KObject> implements GenericRepository<KO> {
	protected constructor(protected ctx: ExoContext,
						  private koc?: KOC) {
	}

	async find(filter: (ko: KO) => boolean): Promise<KO[]> {
		let all = await this.findAll();
		return all.filter(filter);
	}

	async findById(id: UUID): Promise<KO | null> {
		const all = await this.findAll();
		return all.find(a => a.id === id) ?? null
	}

	async findByKOC(koc: KOC): Promise<KO[]> {
		const all = await this.findAll();
		return all.filter(ko => ko.koc === koc);
	}

	async findAll(): Promise<KO[]> {
		const files: TFile[] = this.ctx.appUtils.getAllNotes().filter(f => {
			if (!this.koc) {
				return true;
			}

			const tags = this.ctx.appUtils.getTagsFromFile(f);
			return tags.some(tag => tag.startsWith(this.koc!));
		});
		return Promise.all(files.map(async f => {
			return await this.ctx.kObjectCreator.createFromFileTyped(f) as KO; // TODO error-prone
		}));
	}

	async save(ko: KO): Promise<void> {
		const folderPath: string = this.ctx.koPathRulesHelper.getFolderPath(ko)
		const filePath = folderPath + "/" + ko.title + ".md";
		const fileContent = this.serialize(ko);

		await this.ctx.appUtils.createFile(filePath, fileContent);
	}

	async update(ko: KO): Promise<void> {
		const file = this.ctx.appUtils.getObjectFileOrThrow(ko);
		const data = this.serialize(ko);
		await this.ctx.appUtils.updateFile(file, data);
	}

	protected getLinkToKO(ko: KObject): string {
		return `[[${ko.title}]]`;
	}

	protected serializeKoSpecificProps(ko: KO): string {
		return "";
	}

	private serialize(ko: KO) {
		let result = "";
		result += "---\n";
		result += "tags:\n";
		result += ` - ${ko.koc}\n`;
		result += "uid: " + ko.id + "\n";
		result += this.serializeKoSpecificProps(ko);
		result += "---\n";
		result += ko.body;
		return result;
	}
}
