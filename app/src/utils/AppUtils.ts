import {App, CachedMetadata, FrontMatterCache, TFile} from "obsidian";
import KObject from "../../../core/src/domain/KObject";
import ExoContext from "../../../common/ExoContext";

export default class AppUtils {
	private app: App = this.ctx.app;

	constructor(private ctx: ExoContext) {
	}

	async createFolderIfNotExists(folderPath: string) {
		if (!await this.app.vault.adapter.exists(folderPath)) {
			await this.app.vault.createFolder(folderPath);
		}
	}

	async createFileIfNotExists(filePath: string) {
		if (!await this.app.vault.adapter.exists(filePath)) {
			await this.createFile(filePath, "");
		}
	}

	async createFile(path: string, content: string) {
		const file = await this.app.vault.create(path, content);
		await this.waitCacheUpdate(file);
		return file;
	}

	async updateFile(file: TFile, content: string) {
		await this.app.vault.modify(file, content);
		await this.waitCacheUpdate(file);
	}

	async appendToFile(filePath: string, message: string) {
		await this.app.vault.adapter.append(filePath, message);
	}

	async move(ko: KObject, folderPath: string) {
		const file = this.getObjectFileOrThrow(ko);
		await this.app.fileManager.renameFile(file, folderPath + "/" + ko.title + ".md");
	}

	async openKObject(ko: KObject) {
		const file = this.getObjectFileOrThrow(ko);
		await this.openFile(file);
	}

	async openFile(file: TFile) {
		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file);
	}

	getActiveFileOrThrow(): TFile {
		const file = this.getActiveFileOrNull();
		if (!file) {
			throw new Error('No note opened.');
		}

		return file;
	}

	getActiveFileOrNull(): TFile | null {
		return this.app.workspace.getActiveFile();
	}

	// TODO should be used only once in AbstractSerde
	getFileFromStrLink(strLink: string): TFile {
		let linkWithoutBrackets = strLink.replace("[[", "").replace("]]", "");
		if (strLink.contains("|")) {
			linkWithoutBrackets = linkWithoutBrackets.split("|")[0];
		}

		if (strLink.contains("/")) {
			return this.getFileByPathOrThrow(linkWithoutBrackets + ".md");
		} else {
			return this.getFileByNameOrThrow(linkWithoutBrackets + ".md");
		}
	}

	getFrontmatterOrNull(file: TFile): FrontMatterCache | null {
		try {
			return this.getFrontmatterOrThrow(file)
		} catch (e) {
			return null;
		}
	}

	getFrontmatterOrThrow(file: TFile): FrontMatterCache {
		const fileCache = this.app.metadataCache.getFileCache(file);
		if (!fileCache) {
			throw new Error(`File cache not found for ${file.path}`);
		}
		if (!fileCache.frontmatter) {
			throw new Error(`Frontmatter not found for ${file.path}`);
		}
		return fileCache.frontmatter;
	}

	getTagsFromFile(file: TFile): string[] {
		const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;

		if (frontmatter && frontmatter.tags) {
			if (typeof frontmatter.tags === "string") {
				return frontmatter.tags.split(",").map(tag => tag.trim());
			}

			if (Array.isArray(frontmatter.tags)) {
				return frontmatter.tags;
			}
		}
		return [];
	}

	getFileByNameOrThrow(parentFileName: string): TFile {
		const tFile = this.getAllNotes().filter(f => f.name == parentFileName)[0];
		if (!tFile) {
			throw new Error("File not found by name " + parentFileName);
		}
		return tFile;
	}

	getFileByPathOrThrow(filePath: string): TFile {
		let file = this.app.vault.getFileByPath(filePath);
		if (!file) {
			throw new Error("File not found by path " + filePath);
		}
		return file;
	}

	getAllNotes(): TFile[] {
		return this.app.vault.getMarkdownFiles()
			.filter(f => !f.path.startsWith("9 Meta/9 Templates") && !f.path.startsWith("Scripts"));
	}

	findNotes(filter: (f: TFile) => boolean) {
		return this.getAllNotes().filter(filter);
	}

	getObjectFileOrThrow(ko: KObject): TFile {
		let res = this.getObjectFile(ko);
		if (!res) {
			throw new Error("Object file not found for " + ko);
		}
		return res;
	}

	getObjectFile(ko: KObject): TFile | null {
		const a = this.findNotes(f => {
			const frontmatter = this.getFrontmatterOrNull(f);
			if (!frontmatter) {
				return false;
			}

			const id: string = frontmatter["uid"];
			return id === ko.id;
		});
		return a[0];
	}

	getFileContent(file: TFile) {
		return this.app.vault.read(file);
	}

	async getFileBody(file: TFile): Promise<string> {
		const content = await this.getFileContent(file);
		return content.replace(/---[\s\S]*?---/, "").trim();
	}

	private async waitCacheUpdate(file: TFile) {
		const fileCachePromise = new Promise<CachedMetadata | null>((resolve) => {
			const onCacheUpdate = (updatedFile: TFile) => {
				if (updatedFile.path === file.path) {
					const fileCache = this.app.metadataCache.getFileCache(file);
					this.app.metadataCache.off("changed", onCacheUpdate); // Убираем подписку
					resolve(fileCache || null); // Обрабатываем случай с null
				}
			};

			this.app.metadataCache.on("changed", onCacheUpdate);
		});

		await fileCachePromise;
	}
}
