import CreateMeetingUseCase, {CreateMeetingCommand} from "../ports/input/CreateMeetingUseCase";
import ExoContext from "../../../common/ExoContext";
import Meeting, {MeetingBuilder} from "../domain/ems/meeting/Meeting";
import {EffortStatus} from "../domain/ems/effort/EffortStatus";

export default class CreateMeetingService implements CreateMeetingUseCase {
	constructor(private ctx: ExoContext) {
	}

	async create(cmd: CreateMeetingCommand): Promise<Meeting> {
		const builder = new MeetingBuilder();
		builder.id = this.ctx.utils.generateUid();
		builder.title = `(MT) ${cmd.title}`;
		builder.prototype = cmd.prototype;
		builder.area = cmd.area;
		builder.parentEffort = cmd.parentEffort;
		builder.status = EffortStatus.DRAFT;
		const Meeting = builder.build();

		await this.ctx.meetingRepository.save(Meeting);

		return Meeting;
	}
}
