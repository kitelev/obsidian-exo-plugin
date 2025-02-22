import Effort from "../../domain/ems/effort/Effort";
import EffortAction from "../../domain/ems/effort/EffortAction";

export default interface EffortUseCases {
    execute(effort: Effort, action: EffortAction): Promise<void>;
}
