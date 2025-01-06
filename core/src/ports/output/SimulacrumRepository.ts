import MOC from "../../domain/ims/MOC";
import Simulacrum from "../../domain/ims/Simulacrum";

export default interface SimulacrumRepository {
	findByMOC(moc: MOC): Promise<Simulacrum[]>
}
