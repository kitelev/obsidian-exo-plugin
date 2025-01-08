import Area from "../../domain/ems/Area";
import GenericRepository from "./GenericRepository";

export default interface AreaRepository extends GenericRepository<Area> {
	findChildren(parent: Area): Promise<Area[]>
}
