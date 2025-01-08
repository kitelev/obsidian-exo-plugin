import Meeting from "../../domain/ems/meeting/Meeting";
import MeetingPrototype from "../../domain/ems/meeting/MeetingPrototype";
import Area from "../../domain/ems/Area";
import Effort from "../../domain/ems/effort/Effort";

export default interface CreateMeetingUseCase {
	create(createMeetingCommand: CreateMeetingCommand): Promise<Meeting>;
}

export class CreateMeetingCommand {
	public title: string;
	public prototype?: MeetingPrototype;
	public area?: Area;
	public parentEffort?: Effort;
}
