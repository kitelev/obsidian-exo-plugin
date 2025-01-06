import Effort from "../../domain/ems/effort/Effort";

export default interface EffortEndUseCase {
	end(effort: Effort): Promise<void>;
}
