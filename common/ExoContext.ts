import {App} from "obsidian";
import DailyNoteRepository from "../core/src/ports/output/DailyNoteRepository";
import Utils from "../core/src/utils/Utils";
import DailyNoteCreator from "../app/src/utils/creators/DailyNoteCreator";
import KObjectCreator from "../app/src/utils/creators/KObjectCreator";
import AppUtils from "../app/src/utils/AppUtils";
import DailyNotePersistenceAdapter from "../app/src/adapters/output/DailyNotePersistenceAdapter";
import GetCurrentDailyNoteUseCase from "../core/src/ports/input/GetCurrentDailyNoteUseCase";
import GetCurrentDailyNoteService from "../core/src/service/GetCurrentDailyNoteService";
import CreateEffortUseCase from "../core/src/ports/input/CreateEffortUseCase";
import CreateEffortService from "../core/src/service/CreateEffortService";
import EffortRepository from "../core/src/ports/output/EffortRepository";
import EffortPersistenceAdapter from "../app/src/adapters/output/EffortPersistenceAdapter";
import KObjectUtility from "../app/src/utils/KObjectUtility";
import EffortPathRulesHelper from "../app/src/helpers/EffortPathRulesHelper";
import EffortCreator from "../app/src/utils/creators/EffortCreator";
import AreaCreator from "../app/src/utils/creators/AreaCreator";
import LayoutFactory from "../app/src/adapters/input/layouts/LayoutFactory";
import DvApiHolder from "../app/src/utils/dv/DvApiHolder";
import LinksRegistry from "../app/src/utils/LinksRegistry";
import MOCCreator from "../app/src/utils/creators/MOCCreator";
import MocRepository from "../core/src/ports/output/MocRepository";
import MocPersistenceAdapter from "../app/src/adapters/output/MocPersistenceAdapter";
import PropertyCreator from "../app/src/utils/creators/PropertyCreator";
import KOCObjectCreator from "../app/src/utils/creators/KOCObjectCreator";
import KObjectRepository from "../core/src/ports/output/KObjectRepository";
import KObjectPersistenceAdapter from "../app/src/adapters/output/KObjectPersistenceAdapter";
import EffortPrototypeCreator from "../app/src/utils/creators/EffortPrototypeCreator";
import AreaRepository from "../core/src/ports/output/AreaRepository";
import AreaPersistenceAdapter from "../app/src/adapters/output/AreaPersistenceAdapter";
import BoardCreator from "../app/src/utils/creators/BoardCreator";
import EffortStartUseCase from "../core/src/ports/input/EffortStartUseCase";
import EffortStartService from "../core/src/service/EffortStartService";
import EffortEndUseCase from "../core/src/ports/input/EffortEndUseCase";
import EffortEndService from "../core/src/service/EffortEndService";
import EffortActionFactory from "../app/src/adapters/input/actions/effort-context/EffortActionFactory";
import {ModalItemsFolderFactory} from "../app/src/utils/modal/actions/ModalItemsFolder";
import SimulacrumRepository from "../core/src/ports/output/SimulacrumRepository";
import SimulacrumPersistenceAdapter from "../app/src/adapters/output/SimulacrumPersistenceAdapter";
import SimulacrumCreator from "../app/src/utils/creators/SimulacrumCreator";

export default class ExoContext {
	// Utils
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

	// KO Repositories
	public readonly kObjectRepository: KObjectRepository = new KObjectPersistenceAdapter(this);
	public readonly mocRepository: MocRepository = new MocPersistenceAdapter(this);
	public readonly simulacrumRepository: SimulacrumRepository = new SimulacrumPersistenceAdapter(this);
	public readonly effortRepository: EffortRepository = new EffortPersistenceAdapter(this);
	public readonly dailyNoteRepository: DailyNoteRepository = new DailyNotePersistenceAdapter(this);

	// Domain utils
	public readonly effortPathRulesHelper: EffortPathRulesHelper = new EffortPathRulesHelper(this);

	// Use Cases
	public readonly getCurrentDailyNoteUseCase: GetCurrentDailyNoteUseCase = new GetCurrentDailyNoteService(this);

	public readonly createEffortUseCase: CreateEffortUseCase = new CreateEffortService(this);
	public readonly effortStartUseCase: EffortStartUseCase = new EffortStartService(this);
	public readonly effortEndUseCase: EffortEndUseCase = new EffortEndService(this);

	public readonly layoutFactory: LayoutFactory = new LayoutFactory(this);
	public readonly areaRepository: AreaRepository = new AreaPersistenceAdapter(this);

	// Commands
	public readonly effortCommandFactory: EffortActionFactory = new EffortActionFactory(this);

	constructor(public app: App) {
	}
}
