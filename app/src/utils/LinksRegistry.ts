import ExoContext from "../../../common/ExoContext";
import KObject from "../../../core/src/domain/KObject";

export default class LinksRegistry {
	constructor(private ctx: ExoContext) {
	}

	getKoInboundUnidirectionalLinks(ko: KObject): KObject[] {
		const file = this.ctx.appUtils.getObjectFileOrThrow(ko);
		const linksInbound = this.ctx.linksRegistry.getFileInboundLinks(file.path);
		const linksOutbound = this.ctx.linksRegistry.getFileOutboundLinks(file.path);
		const orphans = linksInbound.filter((inboundLink) => !linksOutbound.includes(inboundLink));

		return orphans.map((orphan) => {
			const file = this.ctx.appUtils.getFileByPathOrThrow(orphan);
			return this.ctx.kObjectCreator.createFromTFile(file);
		});
	}

	/**
	 * Get all the notes that the given note links to
	 *
	 * @param filePath Path of the note to get inbound links for
	 * @returns  Array of paths of notes that link to the given note
	 */
	getFileInboundLinks(filePath: string): string[] {
		const reversedLinks = new Map<string, string[]>();

		Object.entries(this.ctx.app.metadataCache.resolvedLinks)
			.forEach(([sourcePath, links]) => {
				Object.keys(links)
					.forEach((targetPath) => {
						if (!reversedLinks.has(targetPath)) {
							reversedLinks.set(targetPath, []);
						}
						reversedLinks.get(targetPath)?.push(sourcePath);
					});
			});

		return reversedLinks.get(filePath) ?? [];
	}

	/**
	 * Get all the notes that link to the given note
	 *
	 * @param filePath Path of the note to get outbound links for
	 * @returns Array of paths of notes that the given note links to
	 */
	getFileOutboundLinks(filePath: string): string[] {
		return Object.keys(this.ctx.app.metadataCache.resolvedLinks[filePath] ?? {});
	}
}
