import ExoContext from "../../../../../common/ExoContext";
import DateUtils from "../../../../../common/utils/DateUtils";
import KObject from "../../../../../core/src/domain/KObject";
import {TFile} from "obsidian";
import Exception from "../../../../../common/utils/Exception";

export class Field<KEYS> {
	public readonly fmPropName: string;
	public readonly koPropName: keyof KEYS;
	public readonly type: FieldType<any>;
}

export interface FieldType<T> {
	de(ctx: ExoContext, str: string): Promise<T>;

	ser(ctx: ExoContext, value: T): string;
}

export class TextFieldType implements FieldType<string> {
	async de(ctx: ExoContext, str: string): Promise<string> {
		return str;
	}

	ser(ctx: ExoContext, value: string): string {
		return value;
	}
}

export class TimestampFieldType implements FieldType<Date> {
	async de(ctx: ExoContext, str: string): Promise<Date> {
		return new Date(str);
	}

	ser(ctx: ExoContext, value: Date): string {
		return DateUtils.formatTimestamp(value);
	}
}

export class LocalDateFieldType implements FieldType<Date> {
	async de(ctx: ExoContext, str: string): Promise<Date> {
		let res = new Date(str);
		res.setHours(0, 0, 0, 0);
		return res;
	}

	ser(ctx: ExoContext, value: Date): string {
		return DateUtils.formatLocalDate(value);
	}
}

export class NumberFieldType implements FieldType<number> {
	async de(ctx: ExoContext, str: string): Promise<number> {
		return parseInt(str);
	}

	ser(ctx: ExoContext, value: number): string {
		return `${value}`;
	}
}

export class EnumFieldType<T> implements FieldType<T> {
	constructor(public readonly enumValues: T[]) {
	}

	async de(ctx: ExoContext, str: string): Promise<T> {
		let res = this.enumValues.filter(value => `${value}` == str).first();
		if (!res) {
			throw new Error("Invalid enum value: " + str);
		}
		return res;
	}

	ser(ctx: ExoContext, value: T): string {
		return `${value}`;
	}
}

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

// export class ArrayFieldType<T> implements FieldType<T[]> {
// 	constructor(private readonly innerType: FieldType<T>) {
// 	}
//
// 	async de(ctx: ExoContext, arr: string[]): Promise<T[]> {
// 		return await Promise.all(arr.map(async str => await this.innerType.de(ctx, str)));
// 	}
//
// 	ser(ctx: ExoContext, koArr: T[]): string {
// 		return koArr.map(value => this.innerType.ser(ctx, value)).join(",");
// 	}
// }
