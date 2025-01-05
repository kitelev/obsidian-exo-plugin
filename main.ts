import {Plugin, TFile} from 'obsidian';
import {ExoMainModal} from "./app/src/ExoMainModal";
import "localforage";
import ExoApi from "./core/src/ExoApi";
import ExoContext from "./common/ExoContext";
import DvRenderer from "./app/src/utils/dv/DvRenderer";

export default class ExoPlugin extends Plugin {
	private api: ExoApi;
	private ctx: ExoContext;

	async onload() {
		this.ctx = new ExoContext(this.app);
		this.api = new ExoApi(this.ctx);

		this.addRibbonIcon('star', 'Exocortex commands List', () => {
			new ExoMainModal(this.ctx).open();
		});

		this.registerMarkdownPostProcessor(async (el, ctx) => {
			if (!ctx.frontmatter || !ctx.frontmatter.tags) {
				return;
			}

			if (el.classList.contains("mod-ui")) {
				const renderer = new DvRenderer(this.ctx, ctx, this);

				const file: TFile = this.ctx.appUtils.getFileByPathOrThrow(ctx.sourcePath);

				const ko = await this.ctx.kObjectCreator.createFromTFileTypedOrNull(file);
				if (ko === null) {
					console.warn(`Could not create KObject from file ${file.path}`);
					return;
				}

				const layout = this.ctx.layoutFactory.create(ko, renderer);
				if (layout === null) {
					console.warn(`Could not create layout for KObject ${ko.id}`);
					return;
				}

				await layout.render(ko, el);
			}
		});
	}
}
