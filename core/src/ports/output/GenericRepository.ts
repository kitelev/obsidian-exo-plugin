import KObject from "../../domain/KObject";
import {UUID} from "node:crypto";
import {KOC} from "../../domain/KOC";

export default interface GenericRepository<KO extends KObject> {
	findById(id: UUID): Promise<KO | null>;

	find(filter: (e: KO) => boolean): Promise<KO[]>;

	findByKOC(koc: KOC): Promise<KO[]>

	findAll(): Promise<KO[]>;

	save(ko: KO): Promise<void>;

	update(ko: KO): Promise<void>;
}
