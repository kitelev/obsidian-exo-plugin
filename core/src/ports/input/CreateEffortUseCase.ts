import Effort from "../../domain/ems/effort/Effort";
import Area from "../../domain/ems/Area";

export default interface CreateEffortUseCase {
	taskUnderArea(area: Area): Promise<Effort>;

	taskUnderEffort(parentEffort: Effort): Promise<Effort>;
}
