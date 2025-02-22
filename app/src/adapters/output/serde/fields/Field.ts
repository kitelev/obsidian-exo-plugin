import {FieldType} from "./FieldType";

export class Field<KEYS> {
	public readonly fmPropName: string;
	public readonly koPropName: keyof KEYS;
	public readonly type: FieldType<any>;
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
