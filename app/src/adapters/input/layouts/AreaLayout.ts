import ExoContext from "../../../../../common/ExoContext";
import Area from "../../../../../core/src/domain/ems/Area";
import DvRenderer from "../../../utils/dv/DvRenderer";
import Effort from "../../../../../core/src/domain/ems/effort/Effort";
import {EffortStatusComparator} from "../../../../../core/src/domain/ems/effort/EffortStatus";
import Comparator from "../../../../../common/Comparator";
import AbstractLayout from "./AbstractLayout";

export default class AreaLayout extends AbstractLayout<Area> {
    constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
        super(ctx, dvRenderer);
    }

    async render(ko: Area, el: HTMLElement): Promise<void> {
        const unresolvedEfforts = await this.ctx.effortRepository.find(e => {
			if (e.getRelatedArea() === null) {
                return false;
            }
			const sameArea = e.getRelatedArea()!.id == ko.id;
            const unresolved = e.isUnresolved();
            return sameArea && unresolved;
        });

        if (unresolvedEfforts.length > 0) {
            let header = this.createH1("Unresolved Efforts");
            el.appendChild(header);

            const dvTable = await this.createTable(unresolvedEfforts);
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
				const aresStr = e.getRelatedArea()?.name ?? "--"; // TODO use inherited area
                const statusStr = e.status;
                const votesStr = e.getVotes();
                return [effortLink, aresStr, statusStr, votesStr];
            });
        return await this.dvRenderer.table(headers, rows);
    }
}
