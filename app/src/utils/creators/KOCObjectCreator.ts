import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import AbstractCreator from "./AbstractCreator";
import ExoContext from "../../../../common/ExoContext";
import KOCObject from "../../../../core/src/domain/KOCObject";
import KOCFactory from "../KOCFactory";

export default class KOCObjectCreator extends AbstractCreator<KOCObject> {
	constructor(ctx: ExoContext) {
		super(ctx);
	}

	async createInternal(file: TFile, id: UUID, fm: FrontMatterCache): Promise<KOCObject> {
		const implKocStr = fm["tagNames"] as string;
		const implKoc = KOCFactory.getByValue(implKocStr[0]);
		return new KOCObject(id, implKoc);
	}
}
