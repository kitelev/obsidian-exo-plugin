import {App} from "obsidian";
import DailyNoteRepository from "../core/src/ports/output/DailyNoteRepository";
import Utils from "../core/src/utils/Utils";
import DailyNoteCreator from "../app/src/adapters/output/creators/DailyNoteCreator";
import KObjectCreator from "../app/src/adapters/output/creators/KObjectCreator";
import AppUtils from "../app/src/utils/AppUtils";
import DailyNotePersistenceAdapter from "../app/src/adapters/output/persistence/DailyNotePersistenceAdapter";
import GetCurrentDailyNoteUseCase from "../core/src/ports/input/GetCurrentDailyNoteUseCase";
import GetCurrentDailyNoteService from "../core/src/service/GetCurrentDailyNoteService";
import CreateEffortUseCase from "../core/src/ports/input/CreateEffortUseCase";
import CreateEffortService from "../core/src/service/CreateEffortService";
import EffortRepository from "../core/src/ports/output/EffortRepository";
import EffortPersistenceAdapter from "../app/src/adapters/output/persistence/EffortPersistenceAdapter";
import KObjectUtility from "../app/src/utils/KObjectUtility";
import EffortCreator from "../app/src/adapters/output/creators/EffortCreator";
import AreaCreator from "../app/src/adapters/output/creators/AreaCreator";
import LayoutFactory from "../app/src/adapters/input/layouts/LayoutFactory";
import DvApiHolder from "../app/src/utils/dv/DvApiHolder";
import LinksRegistry from "../app/src/utils/LinksRegistry";
import MOCCreator from "../app/src/adapters/output/creators/MOCCreator";
import MocRepository from "../core/src/ports/output/MocRepository";
import MocPersistenceAdapter from "../app/src/adapters/output/persistence/MocPersistenceAdapter";
import PropertyCreator from "../app/src/adapters/output/creators/PropertyCreator";
import KOCObjectCreator from "../app/src/adapters/output/creators/KOCObjectCreator";
import KObjectRepository from "../core/src/ports/output/KObjectRepository";
import KObjectPersistenceAdapter from "../app/src/adapters/output/persistence/KObjectPersistenceAdapter";
import EffortPrototypeCreator from "../app/src/adapters/output/creators/EffortPrototypeCreator";
import AreaRepository from "../core/src/ports/output/AreaRepository";
import AreaPersistenceAdapter from "../app/src/adapters/output/persistence/AreaPersistenceAdapter";
import BoardCreator from "../app/src/adapters/output/creators/BoardCreator";
import {ModalItemsFolderFactory} from "../app/src/utils/modal/actions/ModalItemsFolder";
import SimulacrumRepository from "../core/src/ports/output/SimulacrumRepository";
import SimulacrumPersistenceAdapter from "../app/src/adapters/output/persistence/SimulacrumPersistenceAdapter";
import SimulacrumCreator from "../app/src/adapters/output/creators/SimulacrumCreator";
import KObjectPathRulesHelper from "../app/src/helpers/KObjectPathRulesHelper";
import {UUID} from "node:crypto";
import Effort from "../core/src/domain/ems/effort/Effort";
import EffortPrototypePersistenceAdapter
	from "../app/src/adapters/output/persistence/EffortPrototypePersistenceAdapter";
import EffortPrototypeRepository from "../core/src/ports/output/EffortPrototypeRepository";
import {FileLogger} from "../app/src/utils/FileLogger";
import UserFriendly from "../app/src/utils/UserFriendly";
import EffortService from "../core/src/service/EffortService";

export default class ExoContext {
	// Utils
	public readonly fileLogger: FileLogger = new FileLogger(this, "/Logs");
	public readonly userFriendlyWithFileLog: UserFriendly = new UserFriendly(this);
	public readonly dateSupplier: { get(): Date } = {
		get: () => new Date()
	};
	public readonly utils: Utils = new Utils();
	public readonly appUtils: AppUtils = new AppUtils(this);
	public readonly dvApiHolder: DvApiHolder = new DvApiHolder(this);
	public readonly kObjectUtility: KObjectUtility = new KObjectUtility(this);
	public readonly linksRegistry: LinksRegistry = new LinksRegistry(this);

	public readonly modalItemsFolderFactory: ModalItemsFolderFactory = new ModalItemsFolderFactory(this);

	// KO Creators
	public readonly kObjectCreator: KObjectCreator = new KObjectCreator(this);
	public readonly dailyNoteCreator: DailyNoteCreator = new DailyNoteCreator(this);
	public readonly areaCreator: AreaCreator = new AreaCreator(this);
	public readonly effortCreator: EffortCreator = new EffortCreator(this);
	public readonly effortPrototypeCreator: EffortPrototypeCreator = new EffortPrototypeCreator(this);
	public readonly boardCreator: BoardCreator = new BoardCreator(this);
	public readonly mocCreator: MOCCreator = new MOCCreator(this);
	public readonly simulacrumCreator: SimulacrumCreator = new SimulacrumCreator(this);
	public readonly propertyCreator: PropertyCreator = new PropertyCreator(this);
	public readonly kocObjectCreator: KOCObjectCreator = new KOCObjectCreator(this);

	public readonly effortCache: EffortCache = new EffortCache();

	// KO Repositories
	public readonly kObjectRepository: KObjectRepository = new KObjectPersistenceAdapter(this);
	public readonly mocRepository: MocRepository = new MocPersistenceAdapter(this);
	public readonly simulacrumRepository: SimulacrumRepository = new SimulacrumPersistenceAdapter(this);
	public readonly effortRepository: EffortRepository = new EffortPersistenceAdapter(this);
	public readonly effortPrototypeRepository: EffortPrototypeRepository = new EffortPrototypePersistenceAdapter(this);
	public readonly dailyNoteRepository: DailyNoteRepository = new DailyNotePersistenceAdapter(this);

	// Domain utils
	public readonly koPathRulesHelper: KObjectPathRulesHelper = new KObjectPathRulesHelper(this);

	// Use Cases
	public readonly getCurrentDailyNoteUseCase: GetCurrentDailyNoteUseCase = new GetCurrentDailyNoteService(this);

	public readonly effortService: EffortService = new EffortService(this);

	public readonly createEffortUseCase: CreateEffortUseCase = new CreateEffortService(this);

	public readonly layoutFactory: LayoutFactory = new LayoutFactory(this);
	public readonly areaRepository: AreaRepository = new AreaPersistenceAdapter(this);

	constructor(public app: App) {
	}
}

export class EffortCache {
	private cache: Map<UUID, Effort> = new Map();

	public get(id: UUID): Effort | undefined {
		return this.cache.get(id);
	}

	public set(id: UUID, effort: Effort): void {
		this.cache.set(id, effort);
	}

	public clear() {
		this.cache.clear();
	}
}
