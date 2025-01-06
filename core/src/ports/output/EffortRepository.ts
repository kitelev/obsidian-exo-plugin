import Effort from "../../domain/ems/effort/Effort";

export default interface EffortRepository {
	save(effort: Effort): Promise<void>;

	find(filter: (e: Effort) => boolean): Promise<Effort[]>;

	update(effort: Effort): Promise<void>;
}
