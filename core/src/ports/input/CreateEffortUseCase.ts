import Effort from "../../domain/ems/effort/Effort";
import Area from "../../domain/ems/Area";
import EffortPrototype from "../../domain/ems/effort/EffortPrototype";

export default interface CreateEffortUseCase {
	createTask(title: string, area?: Area): Promise<Effort>;

	taskUnderArea(area: Area, title?: string): Promise<Effort>;

	taskUnderEffort(parentEffort: Effort, title?: string, area?: Area): Promise<Effort>;

	taskUnderPrototype(prototype: EffortPrototype, title?: string): Promise<Effort>;
}
