import ExoContext from "../../../../../../common/ExoContext";

export interface FieldType<T> {
	de(ctx: ExoContext, str: string): Promise<T>;

	ser(ctx: ExoContext, value: T): string;
}
