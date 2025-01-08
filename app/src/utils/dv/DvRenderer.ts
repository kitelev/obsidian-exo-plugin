import ExoContext from "../../../../common/ExoContext";
import {Component, MarkdownPostProcessorContext} from "obsidian";
import {Link} from "obsidian-dataview";
import KObject from "../../../../core/src/domain/KObject";

/**
 * Dataview renderer for MarkdownPostProcessing
 */
export default class DvRenderer {
	private dvApi;

	constructor(private exoCtx: ExoContext,
				private mdCtx: MarkdownPostProcessorContext,
				private component: Component) {
		this.dvApi = this.exoCtx.dvApiHolder.dvApi;
	}

	async listKOs(objects: KObject[]) { // TODO replace with table
		const links = objects.map((ko) => {
			let koPath = this.exoCtx.appUtils.getObjectFileOrThrow(ko).path;
			return this.dvApi.fileLink(koPath);
		});

		return await this.list(links);
	}

	async list(links: Link[]) {
		const div = document.createElement("div");
		div.addClass("dv-renderer");

		await this.dvApi.list(links, div, this.component,
			this.mdCtx.sourcePath
		);

		return div;
	}

	async table(headers: string[], rows: any[][]) {
		const div = document.createElement("div");
		div.addClass("dv-renderer");

		await this.dvApi.table(headers, rows, div, this.component,
			this.mdCtx.sourcePath
		);

		return div;
	}
}
