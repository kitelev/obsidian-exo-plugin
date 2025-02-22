import Effort from "../../domain/ems/effort/Effort";

export default interface EffortUseCases {
	start(effort: Effort): Promise<void>;

	hold(effort: Effort): Promise<void>;

	resume(effort: Effort): Promise<void>;

	end(effort: Effort): Promise<void>;
}
