import {Plugin, TFile} from 'obsidian';
import {ExoModal} from "./app/src/utils/modal/actions/ExoModal";
import "localforage";
import ExoApi from "./core/src/ExoApi";
import ExoContext from "./common/ExoContext";
import DvRenderer from "./app/src/utils/dv/DvRenderer";
import OpenCurrentDailyNote from "./app/src/adapters/input/actions/no-context/domain/OpenCurrentDailyNote";
import {ModalItem} from "./app/src/utils/modal/actions/ModalItem";
import FindDuplicateIds from "./app/src/adapters/input/actions/no-context/utilities/FindDuplicateIds";
import CountNotes from "./app/src/adapters/input/actions/no-context/utilities/CountNotes";
import CreateEffort from "./app/src/adapters/input/actions/no-context/domain/CreateEffort";
import AddMissingFrontmatter from "./app/src/adapters/input/actions/no-context/utilities/AddMissingFrontmatter";
import AddMissingUid from "./app/src/adapters/input/actions/no-context/utilities/AddMissingUid";
import CountNotesWithoutId from "./app/src/adapters/input/actions/no-context/utilities/CountNotesWithoutId";
import CreateEmptyNoteWithinInbox from "./app/src/adapters/input/actions/no-context/domain/CreateEmptyNoteWithinInbox";
import DeleteRedundantFileContentRegexp
	from "./app/src/adapters/input/actions/no-context/utilities/DeleteRedundantFileContentRegexp";
import FindNotesWithoutFrontmatter
	from "./app/src/adapters/input/actions/no-context/utilities/FindNotesWithoutFrontmatter";
import GetActiveFileTags from "./app/src/adapters/input/actions/no-context/utilities/GetActiveFileTags";
import GetCurrentKOC from "./app/src/adapters/input/actions/no-context/utilities/GetCurrentKOC";
import OpenRandomNote from "./app/src/adapters/input/actions/no-context/utilities/OpenRandomNote";
import CreateEffortBySelectedText from "./app/src/adapters/input/actions/no-context/domain/CreateEffortBySelectedText";
import TimeoutUtils from "./common/utils/TimeoutUtils";
import CacheDrop from "./app/src/adapters/input/actions/no-context/utilities/CacheDrop";
import MoveToSuitableFolderAction from "./app/src/adapters/input/actions/ko-context/MoveToSuitableFolderAction";

export default class ExoPlugin extends Plugin {
	private api: ExoApi;
	private ctx: ExoContext;

	async onload() {
		this.ctx = new ExoContext(this.app);
		this.api = new ExoApi(this.ctx);

		this.addRibbonIcon('star', 'Exocortex actions List', () => {
			this.openExoModal();
		});

		this.addCommand({
			id: "hotkey-example",
			name: "Show Hotkey Notice",
			callback: () => {
				this.openExoModal();
			},
			hotkeys: [
				{
					modifiers: ["Mod"],
					key: "E",
				},
			],
		});

		this.registerMarkdownPostProcessor(async (el, ctx) => {
			if (!ctx.frontmatter || !ctx.frontmatter.tags) {
				return;
			}

			if (el.classList.contains("mod-ui") && !el.classList.contains("markdown-preview-view")) {
				const renderer = new DvRenderer(this.ctx, ctx, this);

				const file: TFile = this.ctx.appUtils.getFileByPathOrThrow(ctx.sourcePath);

				const ko = await this.ctx.kObjectCreator.createFromFileTyped(file).catch((e) => {
					console.error(`Could not create KObject`, file, e);
					return null;
				});
				if (ko === null) {
					return;
				}

				console.debug(`Creating layout for KObject...`, ko);
				const layout = this.ctx.layoutFactory.create(ko, renderer);
				if (layout === null) {
					console.debug('No layout defined for KObject', ko);
					return;
				}

				await TimeoutUtils.withTimeout(async () => {
					await this.ctx.userFriendlyWithFileLog.callAsync(async () => {
						await layout.render(ko, el);
					});
				}, 10000);

				el.appendChild(document.createElement("hr"));

				console.debug(`Layout created`);
			}
		});
	}

	private openExoModal() {
		const folderFactory = this.ctx.modalItemsFolderFactory;

		const items: ModalItem[] = [
			new MoveToSuitableFolderAction(this.ctx),
			folderFactory.create("Domain", [
				new CreateEmptyNoteWithinInbox(this.ctx),
				new CreateEffort(this.ctx),
				new CreateEffortBySelectedText(this.ctx),
				new OpenCurrentDailyNote(this.ctx)
			]),
			folderFactory.create("Utilities", [
				new CacheDrop(this.ctx),
				new AddMissingFrontmatter(this.ctx),
				new AddMissingUid(this.ctx),
				new CountNotes(this.ctx),
				new CountNotesWithoutId(this.ctx),
				new DeleteRedundantFileContentRegexp(this.ctx),
				new FindDuplicateIds(this.ctx),
				new FindNotesWithoutFrontmatter(this.ctx),
				new GetActiveFileTags(this.ctx),
				new GetCurrentKOC(this.ctx),
				new OpenRandomNote(this.ctx)
			])
		];
		new ExoModal(this.ctx, items).open();
	}
}
