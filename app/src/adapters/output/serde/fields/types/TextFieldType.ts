import {FieldType} from "../FieldType";
import ExoContext from "../../../../../../../common/ExoContext";

export class TextFieldType implements FieldType<string> {
	async de(ctx: ExoContext, str: string): Promise<string> {
		return str;
	}

	ser(ctx: ExoContext, value: string): string {
		return value;
	}
}
