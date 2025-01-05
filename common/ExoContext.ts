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

export default class ExoContext { // TODO replace initializers with `= new ClassName(this)`
	// Utils
	public readonly utils: Utils;
	public readonly appUtils: AppUtils;
	public readonly dvApiHolder: DvApiHolder;
	public readonly kObjectUtility: KObjectUtility;
	public readonly linksRegistry: LinksRegistry;

	// KO Creators
	public readonly kObjectCreator: KObjectCreator
	public readonly dailyNoteCreator: DailyNoteCreator;
	public readonly areaCreator: AreaCreator;
	public readonly effortCreator: EffortCreator;
	public readonly mocCreator: MOCCreator;

	// KO Repositories
	public readonly dailyNoteRepository: DailyNoteRepository;
	public readonly mocRepository: MocRepository;
	public readonly effortRepository: EffortRepository;

	// Domain utils
	public readonly effortPathRulesHelper: EffortPathRulesHelper;

	// Use Cases
	public readonly getCurrentDNUseCase: GetCurrentDailyNoteUseCase;
	public readonly createEffortUseCase: CreateEffortUseCase;

	public readonly layoutFactory: LayoutFactory;

	constructor(public app: App) {
		this.utils = new Utils();
		this.appUtils = new AppUtils(this.app);
		this.dvApiHolder = new DvApiHolder(this);
		this.layoutFactory = new LayoutFactory(this);
		this.linksRegistry = new LinksRegistry(this);
		this.kObjectUtility = new KObjectUtility(this);

		this.dailyNoteCreator = new DailyNoteCreator(this);
		this.areaCreator = new AreaCreator(this);
		this.effortCreator = new EffortCreator(this);
		this.kObjectCreator = new KObjectCreator(this);
		this.mocCreator = new MOCCreator(this);

		this.dailyNoteRepository = new DailyNotePersistenceAdapter(this.appUtils, this.dailyNoteCreator);
		this.effortRepository = new EffortPersistenceAdapter(this);
		this.mocRepository = new MocPersistenceAdapter(this);

		this.getCurrentDNUseCase = new GetCurrentDailyNoteService(this.dailyNoteRepository);
		this.createEffortUseCase = new CreateEffortService(this);

		this.effortPathRulesHelper = new EffortPathRulesHelper(this);
	}
}
