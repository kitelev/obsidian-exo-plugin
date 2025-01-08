import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../../common/ExoContext";
import Simulacrum from "../../../../../core/src/domain/ims/Simulacrum";

export default class SimulacrumCreator extends AbstractCreator<Simulacrum> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, title: string, body: string, fm: FrontMatterCache): Promise<Simulacrum> {
		const mocStr: string = fm["moc"];
		if (!mocStr) {
			throw new Error(`Simulacrum ${file.name} does not have a MOC`);
		}

		const mocFile = this.ctx.appUtils.getFileFromStrLink(mocStr);
		const moc = await this.ctx.mocCreator.create(mocFile);

		return new Simulacrum(id, title, body, moc);
	}
}
