import Layout from "./Layout";
import ExoContext from "../../../../../common/ExoContext";
import DvRenderer from "../../../utils/dv/DvRenderer";
import Effort from "../../../../../core/src/domain/effort/Effort";
import {EffortStatusComparator} from "../../../../../core/src/domain/effort/EffortStatus";
import Comparator from "../../../../../common/Comparator";

export default class EffortLayout implements Layout<Effort> {
	constructor(private ctx: ExoContext, private dvRender: DvRenderer) {
	}

	async render(ko: Effort, el: HTMLElement): Promise<void> {
		const childEfforts = await this.ctx.effortRepository.find(e => {
			if (e.parent === null) {
				return false;
			}
			return e.parent.id == ko.id;
		});

		if (childEfforts.length > 0) {
			const childEffortsH1 = this.createH1("Child Efforts");
			el.appendChild(childEffortsH1);


			const unresolved = childEfforts.filter(e => e.isUnresolved());
			if (unresolved.length > 0) {
				const unresolvedEffortsH2 = this.createH2("Unresolved");
				el.appendChild(unresolvedEffortsH2);

				const dvTable = await this.createTable(unresolved);
				el.appendChild(dvTable);
			}

			const resolved = childEfforts.filter(e => e.isResolved());
			if (resolved.length > 0) {
				const resolvedEffortsH2 = this.createH2("Resolved");
				el.appendChild(resolvedEffortsH2);

				const resolvedDvTable = await this.createTable(resolved);
				el.appendChild(resolvedDvTable);
			}
		}
	}

	private createH1(textContent: string) {
		return this.createHeader(textContent, 1);
	}

	private createH2(textContent: string) {
		return this.createHeader(textContent, 2);
	}

	private createHeader(textContent: string, level: number) {
		const header = document.createElement(`h${level}`);
		header.textContent = textContent;
		return header;
	}

	private async createTable(efforts: Effort[]) {
		const headers = ["Effort", "Status", "Votes"];

		const rowsComparator = Comparator.combineCompare(
			EffortStatusComparator.compare,
			Comparator.reverse(Comparator.comparing((e: Effort) => e.getVotes())));

		const rows = efforts
			.sort(rowsComparator)
			.map(e => {
				const effortLink = this.toLink(e);
				const statusStr = e.status;
				const votesStr = e.getVotes();
				return [effortLink, statusStr, votesStr];
			});

		return await this.dvRender.table(headers, rows);
	}

	private toLink(e: Effort) {
		const file = this.ctx.appUtils.getObjectFileOrThrow(e);
		return this.dvRender.dvApi.fileLink(file.path);
	}
}
