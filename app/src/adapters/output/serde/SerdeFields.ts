import {EffortBuilder} from "../../../../../core/src/domain/ems/effort/Effort";
import ExoContext from "../../../../../common/ExoContext";
import DateUtils from "../../../../../common/utils/DateUtils";
import KObject from "../../../../../core/src/domain/KObject";

export class Field {
	public readonly fmPropName: string;
	public readonly koPropName: keyof EffortBuilder;
	public readonly type: FieldType<any>;
}

export interface FieldType<T> {
	de(ctx: ExoContext, str: string): Promise<T>;

	ser(ctx: ExoContext, value: T): string;
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
	async de(ctx: ExoContext, str: string): Promise<KObject> {
		const file = ctx.appUtils.getFileFromStrLink(str);
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
