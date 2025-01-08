import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import AbstractLayout, {EffortFieldEnum} from "./AbstractLayout";
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

			const fieldsToRender = [EffortFieldEnum.AREA, EffortFieldEnum.STATUS, EffortFieldEnum.VOTES];
			const dvTable = await this.createTableSuper(efforts, fieldsToRender);
			el.appendChild(dvTable)
		}
	}
}
