import {FieldType} from "../FieldType";
import ExoContext from "../../../../../../../common/ExoContext";

export class NumberFieldType implements FieldType<number> {
	async de(ctx: ExoContext, str: string): Promise<number> {
		return parseInt(str);
	}

	ser(ctx: ExoContext, value: number): string {
		return `${value}`;
	}
}
