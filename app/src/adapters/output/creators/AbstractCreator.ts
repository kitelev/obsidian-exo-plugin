import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import ExoContext from "../../../../../common/ExoContext";

export default abstract class AbstractCreator<KO> {
	protected constructor(protected ctx: ExoContext) {
	}

	async create(file: TFile): Promise<KO> {
		const fm = this.ctx.appUtils.getFrontmatterOrThrow(file);
		const id: UUID = fm["uid"] as UUID;
		const title = file.name.replace(".md", "");
		const body = await this.ctx.appUtils.getFileBody(file);
		return this.createInternal(file, id, title, body, fm);
	}

	protected abstract createInternal(file: TFile, id: UUID, title: string, body: string, fm: FrontMatterCache): Promise<KO>;
}
