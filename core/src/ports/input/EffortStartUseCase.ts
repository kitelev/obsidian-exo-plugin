import Effort from "../../domain/ems/effort/Effort";

export default interface EffortStartUseCase {
	start(effort: Effort): Promise<void>;
}
