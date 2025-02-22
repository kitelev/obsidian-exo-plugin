import {Field} from "./fields/Field";
import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import ExoContext from "../../../../../common/ExoContext";
import EffortSerde from "./EffortSerde";
import EffortPrototype, {EffortPrototypeBuilder} from "../../../../../core/src/domain/ems/effort/EffortPrototype";
import {KObjectFieldType} from "./fields/types/KObjectFieldType";

export default class EffortPrototypeSerde {

	static readonly FIELDS: Field<EffortPrototypeBuilder>[] = [
		{fmPropName: "e-parent", koPropName: "effortParent", type: new KObjectFieldType()},
		{fmPropName: "area", koPropName: "area", type: new KObjectFieldType()}
	];

	constructor(private ctx: ExoContext) {
	}

	async create(file: TFile,
				 id: UUID,
				 title: string,
				 body: string,
				 fm: FrontMatterCache): Promise<EffortPrototype> {

		const builder = new EffortPrototypeBuilder();
		builder.id = id;
		builder.title = title;
		builder.body = body;

		for (const field of EffortPrototypeSerde.FIELDS) {
			const fmValue = fm[field.fmPropName];
			if (fmValue) {
				(builder as any)[field.koPropName] = await field.type.de(this.ctx, fmValue);
			}
		}

		return builder.build();
	}

	serializeKoSpecificProps(effortPrototype: EffortPrototype): string {
		let result = "";

		EffortSerde.FIELDS.forEach(field => {
			const koValue = (effortPrototype as any)[field.koPropName];
			if (koValue) {
				result += `${field.fmPropName}: ${field.type.ser(this.ctx, koValue)}\n`;
			}
		});

		return result;
	}
}
