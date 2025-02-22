import {describe, it} from '@jest/globals';
import {TimestampFieldType} from './TimestampFieldType';
import DateUtils from '../../../../../../../common/utils/DateUtils';
import TestHelper from "../../../../../../../core/test/TestHelper";

describe('TimestampFieldType', () => {
	const timestampFieldType = new TimestampFieldType();

	it('deserializes valid timestamp string', async () => {
		// given
		const date = TestHelper.randomDate();
		date.setSeconds(0, 0);

		const input = DateUtils.formatTimestamp(date);

		// when
		const result = await timestampFieldType.de(null, input);

		// then
		expect(result).toEqual(date);
	});

	it('serializes date to timestamp string', () => {
		// given
		const date = TestHelper.randomDate();

		// when
		const result = timestampFieldType.ser(null, date);

		// then
		expect(result).toBe(DateUtils.formatTimestamp(date));
	});
});
