import Effort from "../../domain/ems/effort/Effort";
import Area from "../../domain/ems/Area";
import EffortPrototype from "../../domain/ems/effort/EffortPrototype";

export default interface CreateEffortUseCase {
	taskUnderArea(area: Area): Promise<Effort>;

	taskUnderEffort(parentEffort: Effort): Promise<Effort>;

	taskUnderPrototype(prototype: EffortPrototype): Promise<Effort>;
}
