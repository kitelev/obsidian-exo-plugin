import GenericRepository from "./GenericRepository";
import EffortPrototype from "../../domain/ems/effort/EffortPrototype";
import Area from "../../domain/ems/Area";

export default interface EffortPrototypeRepository extends GenericRepository<EffortPrototype> {
	findByArea(ko: Area): Promise<EffortPrototype[]>;
}
