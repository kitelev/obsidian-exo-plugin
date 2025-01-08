import MOC from "../../domain/ims/MOC";
import GenericRepository from "./GenericRepository";

export default interface MocRepository extends GenericRepository<MOC> {
	findChildren(moc: MOC): Promise<MOC[]>
}
