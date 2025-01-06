import Effort from "../../domain/ems/effort/Effort";
import Area from "../../domain/ems/Area";
import EffortPrototype from "../../domain/ems/effort/EffortPrototype";

export default interface CreateEffortUseCase {
	create(createEffortCommand: CreateEffortCommand): Promise<Effort>;
}

export class CreateEffortCommand {
	public title: string;
	public prototype?: EffortPrototype | null;
	public area?: Area | null;
	public parent?: Effort | null;
}
