import {FieldType} from "../FieldType";
import ExoContext from "../../../../../../../common/ExoContext";
import DateUtils from "../../../../../../../common/utils/DateUtils";

export class TimestampFieldType implements FieldType<Date> {
	async de(ctx: ExoContext | null, str: string): Promise<Date> {
		return new Date(str);
	}

	ser(ctx: ExoContext | null, value: Date): string {
		return DateUtils.formatTimestamp(value);
	}
}
