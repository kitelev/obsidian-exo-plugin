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

export default class ExoContext { // TODO replace initializers with `= new ClassName(this)`
	// Utils
	public readonly utils: Utils = new Utils();
	public readonly appUtils: AppUtils = new AppUtils(this);
	public readonly dvApiHolder: DvApiHolder = new DvApiHolder(this);
	public readonly kObjectUtility: KObjectUtility = new KObjectUtility(this);
	public readonly linksRegistry: LinksRegistry = new LinksRegistry(this);

	// KO Creators
	public readonly kObjectCreator: KObjectCreator = new KObjectCreator(this);
	public readonly dailyNoteCreator: DailyNoteCreator = new DailyNoteCreator(this);
	public readonly areaCreator: AreaCreator = new AreaCreator(this);
	public readonly effortCreator: EffortCreator = new EffortCreator(this);
	public readonly mocCreator: MOCCreator = new MOCCreator(this);
	public readonly propertyCreator: PropertyCreator = new PropertyCreator(this);

	// KO Repositories
	public readonly mocRepository: MocRepository = new MocPersistenceAdapter(this);
	public readonly effortRepository: EffortRepository = new EffortPersistenceAdapter(this);
	public readonly dailyNoteRepository: DailyNoteRepository = new DailyNotePersistenceAdapter(this);

	// Domain utils
	public readonly effortPathRulesHelper: EffortPathRulesHelper = new EffortPathRulesHelper(this);

	// Use Cases
	public readonly getCurrentDNUseCase: GetCurrentDailyNoteUseCase = new GetCurrentDailyNoteService(this);
	public readonly createEffortUseCase: CreateEffortUseCase = new CreateEffortService(this);

	public readonly layoutFactory: LayoutFactory = new LayoutFactory(this);

	constructor(public app: App) {
	}
}
