import Effort from "../../domain/ems/effort/Effort";
import GenericRepository from "./GenericRepository";

export default interface EffortRepository extends GenericRepository<Effort> {
	save(effort: Effort): Promise<void>;

	update(effort: Effort): Promise<void>;
}
