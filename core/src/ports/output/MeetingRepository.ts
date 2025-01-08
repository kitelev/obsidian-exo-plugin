import Meeting from "../../domain/ems/meeting/Meeting";

export default interface MeetingRepository {
	save(meeting: Meeting): Promise<void>;

	find(filter: (e: Meeting) => boolean): Promise<Meeting[]>;

	update(meeting: Meeting): Promise<void>;
}
