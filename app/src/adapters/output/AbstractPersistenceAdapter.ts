import ExoContext from "../../../../common/ExoContext";
import {KOC} from "../../../../core/src/domain/KOC";
import KObject from "../../../../core/src/domain/KObject";
import {TFile} from "obsidian";
import {UUID} from "node:crypto";
import Area from "../../../../core/src/domain/ems/Area";
import Effort from "../../../../core/src/domain/ems/effort/Effort";
import GenericRepository from "../../../../core/src/ports/output/GenericRepository";

export default class AbstractPersistenceAdapter<KO extends KObject> implements GenericRepository<KO> {
    constructor(protected ctx: ExoContext,
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

    protected getLinkToArea(area: Area): string {
        return `[[${area.name}]]`;
    }

    protected getLinkToEffort(parent: Effort): string {
        return `[[${parent.title}]]`;
    }
}
