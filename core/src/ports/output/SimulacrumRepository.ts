import MOC from "../../domain/ims/MOC";
import Simulacrum from "../../domain/ims/Simulacrum";
import GenericRepository from "./GenericRepository";

export default interface SimulacrumRepository extends GenericRepository<Simulacrum> {
	findByMOC(moc: MOC): Promise<Simulacrum[]>
}
