import Area from "../../domain/ems/Area";

export default interface CreateAreaUseCase {
	create(command: CreateAreaCommand): Promise<Area>;
}

export class CreateAreaCommand {
	public title: string;
	public parent?: Area;
}
