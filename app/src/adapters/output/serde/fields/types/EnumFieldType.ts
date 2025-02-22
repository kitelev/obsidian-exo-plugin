import {FieldType} from "../FieldType";
import ExoContext from "../../../../../../../common/ExoContext";

export class EnumFieldType<T> implements FieldType<T> {
	constructor(public readonly enumValues: T[]) {
	}

	async de(ctx: ExoContext | null, str: string): Promise<T> {
		let res = this.enumValues.filter(value => `${value}` == str)[0];
		if (!res) {
			throw new Error("Invalid enum value: " + str);
		}
		return res;
	}

	ser(ctx: ExoContext | null, value: T): string {
		return `${value}`;
	}
}
