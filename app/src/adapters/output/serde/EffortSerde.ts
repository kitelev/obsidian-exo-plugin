import AbstractSerde from "./AbstractSerde";
import {EnumFieldType, Field, KObjectFieldType, NumberFieldType, TimestampFieldType} from "./SerdeFields";
import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import Effort, {EffortBuilder} from "../../../../../core/src/domain/ems/effort/Effort";
import {EffortStatus} from "../../../../../core/src/domain/ems/effort/EffortStatus";

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
		{fmPropName: "votes", koPropName: "votes", type: new NumberFieldType()},
		// {fmPropName: "relates", koPropName: "relates", type: new ArrayFieldType<KObject>(new KObjectFieldType())},
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
