import {Plugin, TFile} from 'obsidian';
import {ExoModal} from "./app/src/utils/modal/ExoModal";
import "localforage";
import ExoApi from "./core/src/ExoApi";
import ExoContext from "./common/ExoContext";
import DvRenderer from "./app/src/utils/dv/DvRenderer";
import OpenCurrentDailyNote from "./app/src/adapters/input/actions/no-context/domain/OpenCurrentDailyNote";
import {ModalItem} from "./app/src/utils/modal/ModalItem";
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

			if (el.classList.contains("mod-ui")) {
				const renderer = new DvRenderer(this.ctx, ctx, this);

				const file: TFile = this.ctx.appUtils.getFileByPathOrThrow(ctx.sourcePath);

				const ko = await this.ctx.kObjectCreator.createFromFileTyped(file).catch((e) => {
					console.error(`Could not create KObject from file ${file.path}`, e);
					return null;
				});
				if (ko === null) {
					return;
				}

				const layout = this.ctx.layoutFactory.create(ko, renderer);
				if (layout === null) {
					console.warn(`Could not create layout for KObject ${ko.id}`);
					return;
				}

				await layout.render(ko, el);

				// TODO add divider after or Exo-wrapper around
			}
		});
	}

	private openExoModal() {
		const folderFactory = this.ctx.modalItemsFolderFactory;

		const items: ModalItem[] = [
			folderFactory.create("Domain", [
				new CreateEmptyNoteWithinInbox(this.ctx),
				new CreateEffort(this.ctx),
				new OpenCurrentDailyNote(this.ctx)
			]),
			folderFactory.create("Utilities", [
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
