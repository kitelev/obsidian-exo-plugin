import Effort from "../../../../../../core/src/domain/ems/effort/Effort";

export default interface EffortCommand {
	execute(effort: Effort): Promise<void>;
}
