import MOC from "../../domain/ims/MOC";

export default interface MocRepository {
	findChildren(moc: MOC): Promise<MOC[]>
}
