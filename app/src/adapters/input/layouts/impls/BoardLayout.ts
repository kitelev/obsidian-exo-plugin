import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";
import {EffortStatusComparator} from "../../../../../../core/src/domain/ems/effort/EffortStatus";
import Comparator from "../../../../../../common/Comparator";
import AbstractLayout from "./AbstractLayout";
import Board from "../../../../../../core/src/domain/ems/Board";

export default class BoardLayout extends AbstractLayout<Board> {
	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: Board, el: HTMLElement): Promise<void> {
		await this.handleUnresolvedEfforts(ko, el);
	}

	private async handleUnresolvedEfforts(ko: Board, el: HTMLElement) {
		const efforts = await this.ctx.effortRepository.find(e => {
			if (e.isResolved()) return false;
			return e.isInAreaOrOneOfItsParents(ko.area);
		});

		if (efforts.length > 0) {
			let header = this.createH1("Unresolved Efforts");
			el.appendChild(header);

			const dvTable = await this.createTable(efforts);
			el.appendChild(dvTable)
		}
	}

	private async createTable(efforts: Effort[]) {
		const headers = ["Effort", "Area", "Status", "Votes"];

		const rowsComparator = Comparator.combineCompare(
			EffortStatusComparator.compare,
			Comparator.reverse(Comparator.comparing((e: Effort) => e.getVotes())));

		const rows = efforts
			.sort(rowsComparator)
			.map(e => {
				const effortLink = this.toLink(e);
				const aresStr = e.getRelatedArea()?.title ?? "--";
				const statusStr = e.status;
				const votesStr = e.getVotes();
				return [effortLink, aresStr, statusStr, votesStr];
			});


		return await this.dvRenderer.table(headers, rows);
	}
}
