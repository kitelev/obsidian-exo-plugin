import Effort from "../../../../../../core/src/domain/ems/effort/Effort";

export default interface EffortAction {
	execute(effort: Effort): Promise<void>;
}
