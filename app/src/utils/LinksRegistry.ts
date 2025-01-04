import ExoContext from "../../../common/ExoContext";

export default class LinksRegistry {
	constructor(private ctx: ExoContext) {
	}

	/**
	 * Get all the notes that the given note links to
	 *
	 * @param filePath Path of the note to get inbound links for
	 * @returns  Array of paths of notes that link to the given note
	 */
	getFileOutboundLinks(filePath: string): string[] {
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
	getFileInboundLinks(filePath: string): string[] {
		return Object.keys(this.ctx.app.metadataCache.resolvedLinks[filePath] ?? {});
	}
}
