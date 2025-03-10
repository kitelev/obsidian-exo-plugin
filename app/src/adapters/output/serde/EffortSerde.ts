import {Field} from "./fields/Field";
import {FrontMatterCache, TFile} from "obsidian";
import {UUID} from "node:crypto";
import Effort, {EffortBuilder} from "../../../../../core/src/domain/ems/effort/Effort";
import {EffortStatus} from "../../../../../core/src/domain/ems/effort/EffortStatus";
import ExoContext from "../../../../../common/ExoContext";
import Exception from "../../../../../common/utils/Exception";
import {TextFieldType} from "./fields/types/TextFieldType";
import {TimestampFieldType} from "./fields/types/TimestampFieldType";
import {NumberFieldType} from "./fields/types/NumberFieldType";
import {EnumFieldType} from "./fields/types/EnumFieldType";
import {KObjectFieldType} from "./fields/types/KObjectFieldType";

export default class EffortSerde {

    static readonly FIELDS: Field<EffortBuilder>[] = [
        {fmPropName: "e-prototype", koPropName: "prototype", type: new KObjectFieldType()},
        {fmPropName: "e-parent", koPropName: "parent", type: new KObjectFieldType()},
        {fmPropName: "area", koPropName: "area", type: new KObjectFieldType()},
        {
            fmPropName: "e-status",
            koPropName: "status",
            type: new EnumFieldType<EffortStatus>(Object.values(EffortStatus))
        },
        {fmPropName: "prerequisite", koPropName: "prerequisite", type: new KObjectFieldType()},
        {fmPropName: "appetite", koPropName: "appetite", type: new TextFieldType()},
        {fmPropName: "planned-start", koPropName: "plannedStart", type: new TimestampFieldType()},
        {fmPropName: "planned-end", koPropName: "plannedEnd", type: new TimestampFieldType()},
        {fmPropName: "due", koPropName: "due", type: new TimestampFieldType()},
        {fmPropName: "started", koPropName: "started", type: new TimestampFieldType()},
        {fmPropName: "ended", koPropName: "ended", type: new TimestampFieldType()},
        {fmPropName: "holds-history", koPropName: "holdsHistory", type: new TextFieldType()},
        {fmPropName: "votes", koPropName: "votes", type: new NumberFieldType()},
        // {fmPropName: "relates", koPropName: "relates", type: new ArrayFieldType<KObject>(new KObjectFieldType())},
    ];

    constructor(private ctx: ExoContext) {
    }

    async create(file: TFile,
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
                (builder as any)[field.koPropName] = await this.deser(field, fmValue);
            }
        }

        for (let fmPropName of Object.keys(fm)) {
            const field = EffortSerde.FIELDS.find(f => f.fmPropName === fmPropName);
            if (field) {
                continue;
            }

            if (fmPropName === "uid" || fmPropName === "tags") {
                continue;
            }

            const value = fm[fmPropName];
            if (value) {
                builder.unknownProps[fmPropName] = value;
            }
        }

        return builder.build();
    }

    private async deser(field: Field<EffortBuilder>, fmValue: any) {
        try {
            return await field.type.de(this.ctx, fmValue);
        } catch (e) {
            throw new Exception(`Error deserializing field ${field.fmPropName} with value ${fmValue}`, e);
        }
    }

    serializeKoSpecificProps(effort: Effort): string {
        let result = "";

        EffortSerde.FIELDS.forEach(field => {
            const koValue = (effort as any)[field.koPropName];
            if (koValue) {
                result += `${field.fmPropName}: ${field.type.ser(this.ctx, koValue)}\n`;
            }
        });

        for (let key of Object.keys(effort.unknownProps)) {
            const value = effort.unknownProps[key];

            if (typeof value === "string") {
                result += `${key}: ${value}\n`;
            } else if (Array.isArray(value)) {
                result += `${key}: \n`;
                value.forEach(v => {
                    result += `  - "${v}"\n`;
                });
            }
        }

        return result;
    }
}
