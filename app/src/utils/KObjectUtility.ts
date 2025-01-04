import ExoContext from "../../../common/ExoContext";
import {Notice, TFile} from "obsidian";

export default class KObjectUtility {
	constructor(private ctx: ExoContext) {
	}

	// noinspection JSUnusedGlobalSymbols
	async addMissingId(): Promise<void> {
		let allMdFiles = this.ctx.appUtils.getAllMdFiles();

		const KOs = allMdFiles.filter(f => {
			const tags = this.ctx.appUtils.getTagsFromFile(f);
			let isKo = tags.some(tag => tag.startsWith("TMS/") || tag.startsWith("IMS/") || tag.startsWith("EMS/") || tag.startsWith("KMS/"));
			return isKo && !f.path.startsWith("9 Meta/");
		});

		const withoutId = KOs.filter(f => {
			let frontmatter = this.ctx.appUtils.getFrontmatterOrThrow(f);
			if (!frontmatter) {
				return false;
			}

			return !frontmatter["uid"];
		})

		for (let f of withoutId) {
			await this.setRandomId(f);
		}
	}

	// noinspection JSUnusedGlobalSymbols
	async replaceDuplicatedIds(): Promise<void> {
		let withDuplicateId = this.findFilesWithDuplicateIds();

		let idx = 0;
		for (let f of withDuplicateId) {
			await this.setRandomId(f);
			idx++;
			if (idx % 10 === 0) {
				new Notice(`Processed ${idx} files`);
			}
		}
	}

	findFilesWithDuplicateIds() {
		let allMdFiles = this.ctx.appUtils.getAllMdFiles();

		const KOs = allMdFiles.filter(f => {
			const tags = this.ctx.appUtils.getTagsFromFile(f);
			let isKo = tags.some(tag => tag.startsWith("TMS/") || tag.startsWith("IMS/") || tag.startsWith("EMS/") || tag.startsWith("KMS/"));
			return isKo && !f.path.startsWith("9 Meta/");
		});

		const withId = KOs.filter(f => {
			let frontmatter = this.ctx.appUtils.getFrontmatterOrThrow(f);
			if (!frontmatter) {
				return false;
			}

			return frontmatter["uid"];
		})

		const ids = withId.map(f => {
			let frontmatter = this.ctx.appUtils.getFrontmatterOrThrow(f);
			return frontmatter["uid"];
		});

		let res = withId.filter((f, index) => {
			let id = this.ctx.appUtils.getFrontmatterOrThrow(f)["uid"];
			return ids.indexOf(id) !== index;
		});

		new Notice(`Found ${res.length} files with duplicate ids`);
		return res;
	}

	private async setRandomId(f: TFile) {
		await this.ctx.app.fileManager.processFrontMatter(f, (frontmatter) => {
			frontmatter['uid'] = this.ctx.utils.generateUid();
		});
	}
}
