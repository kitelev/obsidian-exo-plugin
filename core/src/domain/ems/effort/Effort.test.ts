import {describe, expect, it} from '@jest/globals';
import TestHelper from "../../../../test/TestHelper";
import {EffortStatus} from "./EffortStatus";
import DateUtils from "../../../../../common/utils/DateUtils";

describe('Effort', () => {
	describe('start', () => {
		it('set started date and status', async () => {
				// given
				const effort = TestHelper.createEffort();

				// when
				const date = new Date();
				effort.startWithDate(date);

				// then
				expect(effort.started).toBe(date);
				expect(effort.status).toBe(EffortStatus.STARTED);
			}
		);
	});

	describe('hold', () => {
		it('can be hold only when it is started', async () => {
			// given
			const effort = TestHelper.createEffort();

			// when, then
			expect(() => effort.hold(new Date())).toThrowError("Effort must be started to be put on hold");
		});

		it('appends holds history', async () => {
			// given
			const effort = TestHelper.createEffort();
			effort.start();

			// when
			const holdDate = TestHelper.randomDate();
			effort.hold(holdDate);

			// then
			expect(effort.status).toBe(EffortStatus.HOLD);
			expect(effort.holdsHistory).toBe(`${DateUtils.formatTimestamp(holdDate)}`);
		});
	});

	describe('resume', () => {
		it('can be resumed only when it is on hold', async () => {
			// given
			const effort = TestHelper.createEffort();

			// when, then
			expect(() => effort.resume(new Date())).toThrowError("Effort must be on hold to be resumed");
		});

		it('changes status to started and updates holds history', async () => {
			// given
			const effort = TestHelper.createEffort();
			effort.start();
			const holdDate = new Date();
			effort.hold(holdDate);

			// when
			const resumeDate = TestHelper.randomDate();
			effort.resume(resumeDate);

			// then
			expect(effort.status).toBe(EffortStatus.STARTED);

			const expectedHoldsHistory = `${DateUtils.formatTimestamp(holdDate)} - ${DateUtils.formatTimestamp(resumeDate)}`;
			expect(effort.holdsHistory).toBe(expectedHoldsHistory);
		});
	});
})
