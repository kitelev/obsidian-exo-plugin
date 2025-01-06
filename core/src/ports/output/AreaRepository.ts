import Area from "../../domain/ems/Area";
import {UUID} from "node:crypto";

export default interface AreaRepository {
	findById(id: UUID): Promise<Area | null>;

	findChildren(parent: Area): Promise<Area[]>

	findAll(): Promise<Area[]>;
}
