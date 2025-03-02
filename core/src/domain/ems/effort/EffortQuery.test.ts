import {describe, expect, it} from '@jest/globals';
import TestHelper from "../../../../test/TestHelper";
import EffortQuery from "./EffortQuery";

describe('EffortQuery', () => {
	describe('TIME_SPENT', () => {
		it('should return 0 when effort not started', async () => {
				// given
				const effort = TestHelper.createEffort();

				// when
				const res = EffortQuery.TIME_SPENT.executeFunction(effort);

				// then
				expect(res).toBe(0);
			}
		);

		it('should return time when effort was in progress', async () => {
				// given
				const effort = TestHelper.createEffort();
				effort.startWithDate(new Date(2025, 1, 1, 0, 0, 0, 0));
				effort.hold(new Date(2025, 1, 1, 0, 10, 0, 0));

				// when
				const res = EffortQuery.TIME_SPENT.executeFunction(effort);

				// then
				expect(res).toBe(10);
			}
		);
	});
})
