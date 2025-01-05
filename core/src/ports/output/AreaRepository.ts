import Area from "../../domain/ems/Area";

export default interface AreaRepository {
	findChildren(parent: Area): Promise<Area[]>
}
