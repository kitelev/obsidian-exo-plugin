import {KOC} from "../../domain/KOC";
import KObject from "../../domain/KObject";

export default interface KObjectRepository {
	findByKOC(koc: KOC): Promise<KObject[]>
}
