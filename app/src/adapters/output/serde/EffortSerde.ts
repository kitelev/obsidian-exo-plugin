import AbstractSerde from "./AbstractSerde";
import Effort, {EffortBuilder} from "../../../../../core/src/domain/ems/effort/Effort";
import DateUtils from "../../../../../common/utils/DateUtils";
import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import {EffortStatus} from "../../../../../core/src/domain/ems/effort/EffortStatus";
import KObject from "../../../../../core/src/domain/KObject";
import ExoContext from "../../../../../common/ExoContext";

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

export default class EffortSerde extends AbstractSerde<Effort> {

	static readonly FIELDS: Field[] = [
		{
			fmPropName: "e-status",
			koPropName: "status",
			type: new EnumFieldType<EffortStatus>(Object.values(EffortStatus))
		},
		{fmPropName: "started", koPropName: "started", type: new TimestampFieldType()},
		{fmPropName: "ended", koPropName: "ended", type: new TimestampFieldType()},
		{fmPropName: "e-prototype", koPropName: "prototype", type: new KObjectFieldType()},
		{fmPropName: "e-parent", koPropName: "parent", type: new KObjectFieldType()},
		{fmPropName: "area", koPropName: "area", type: new KObjectFieldType()},
		{fmPropName: "planned-start", koPropName: "plannedStart", type: new TimestampFieldType()},
		{fmPropName: "planned-end", koPropName: "plannedEnd", type: new TimestampFieldType()},
		{fmPropName: "due", koPropName: "due", type: new TimestampFieldType()},
		// {fmPropName: "votes", koPropName: "votes", type: new TimestampFieldType()},
		// {fmPropName: "relates", koPropName: "relates", type: new TimestampFieldType()},
	];

	async createInternal(file: TFile,
						 id: UUID,
						 title: string,
						 body: string,
						 fm: FrontMatterCache): Promise<Effort> {
		const builder = new EffortBuilder();
		builder.id = id;
		builder.title = title;
		builder.body = body;

		for (const field of EffortSerde.FIELDS) {
			const fmValue = fm[field.fmPropName];
			if (fmValue) {
				(builder as any)[field.koPropName] = await field.type.de(this.ctx, fmValue);
			}
		}

		return builder.build();
	}

	serializeKoSpecificProps(effort: Effort): string {
		let result = "";

		EffortSerde.FIELDS.forEach(field => {
			const koValue = (effort as any)[field.koPropName];
			if (koValue) {
				result += `${field.fmPropName}: ${field.type.ser(this.ctx, koValue)}\n`;
			}
		});

		return result;
	}
}
