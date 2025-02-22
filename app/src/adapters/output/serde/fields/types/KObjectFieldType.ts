import {FieldType} from "../FieldType";
import KObject from "../../../../../../../core/src/domain/KObject";
import ExoContext from "../../../../../../../common/ExoContext";
import {TFile} from "obsidian";
import Exception from "../../../../../../../common/utils/Exception";

export class KObjectFieldType implements FieldType<KObject> {
	/**
	 * @throws {Exception} If the file cannot be retrieved from the provided string link.
	 */
	async de(ctx: ExoContext, str: string): Promise<KObject> {
		let file: TFile;
		try {
			file = ctx.appUtils.getFileFromStrLink(str);
		} catch (e) {
			throw new Exception("Failed to get file from link: " + str);
		}

		return await ctx.kObjectCreator.createFromFileTyped(file);
	}

	ser(ctx: ExoContext, ko: KObject): string {
		return `'[[${ko.title}]]'`;
	}
}
