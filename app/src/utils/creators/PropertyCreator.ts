import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import Property from "../../../../core/src/domain/Property";

export default class PropertyCreator extends AbstractCreator<Property> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, title: string, body: string, fm: FrontMatterCache): Promise<Property> {
		return new Property(id, title, body);
	}
}
