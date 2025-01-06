import Effort from "../../domain/ems/effort/Effort";
import Area from "../../domain/ems/Area";
import EffortPrototype from "../../domain/ems/effort/EffortPrototype";

export default interface CreateEffortUseCase {
	createTask(title: string): Promise<Effort>;

	taskUnderArea(area: Area, title?: string): Promise<Effort>;

	taskUnderEffort(parentEffort: Effort, title?: string): Promise<Effort>;

	taskUnderPrototype(prototype: EffortPrototype): Promise<Effort>;
}
