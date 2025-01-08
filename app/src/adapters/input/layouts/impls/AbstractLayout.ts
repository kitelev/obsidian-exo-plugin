import Layout from "../Layout";
import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import KObject from "../../../../../../core/src/domain/KObject";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";
import {EffortStatusComparator} from "../../../../../../core/src/domain/ems/effort/EffortStatus";
import Comparator, {ComparingFn} from "../../../../../../common/Comparator";

export default abstract class AbstractLayout<KO> implements Layout<KO> {
	protected constructor(protected ctx: ExoContext,
						  protected dvRenderer: DvRenderer) {
	}

	abstract render(ko: KO, el: HTMLElement): Promise<void>

	protected createH1(textContent: string) {
		return this.createHeader(textContent, 1);
	}

	protected createH2(textContent: string) {
		return this.createHeader(textContent, 2);
	}

	protected createButton(text: string, onClick: () => Promise<void>): HTMLButtonElement {
		const button = document.createElement("button");
		button.textContent = text;
		button.style.marginRight = "5px";
		button.style.marginBottom = "5px";
		button.style.cursor = "pointer";
		button.style.transition = "transform 0.1s";

		button.addEventListener("mousedown", () => {
			button.style.transform = "scale(0.95)";
		});

		button.addEventListener("mouseup", () => {
			button.style.transform = "scale(1)";
		});

		button.addEventListener("click", onClick);

		return button;
	}

	protected toLink(ko: KObject, prefix: string = "") {
		const file = this.ctx.appUtils.getObjectFileOrThrow(ko);
		return this.ctx.dvApiHolder.dvApi.fileLink(file.path, false, `${prefix}${file.basename}`);
	}

	protected async handleUnresolvedRelatedEfforts(ko: KObject, el: HTMLElement) {
		const efforts = await this.ctx.effortRepository.find(e => {
			if (e.isResolved()) {
				return false;
			}
			return e.relates.some(r => r.id === ko.id);
		});

		if (efforts.length > 0) {
			el.appendChild(this.createH1("Unresolved related efforts"));
			let div = await this.dvRenderer.listKOs(efforts);
			el.appendChild(div);
		}
	}

	protected async handleRelatedEfforts(ko: KObject, el: HTMLElement) {
		const efforts = await this.ctx.effortRepository.find(e => {
			return e.relates?.some(r => r.id === ko.id) || false;
		});

		if (efforts.length > 0) {
			el.appendChild(this.createH1("Related efforts"));
			let div = await this.dvRenderer.listKOs(efforts);
			el.appendChild(div);
		}
	}

	protected async createTableSuper(efforts: Effort[],
									 fieldsToRender: EffortFieldEnum[],
									 fieldsToSort: EffortFieldEnum[] = [EffortFieldEnum.STATUS, EffortFieldEnum.VOTES]): Promise<HTMLElement> {
		const headers = ["Effort", ...fieldsToRender.map(f => EffortField.enum2Field(f).field)];

		const comparatorSuper = Comparator.combine(fieldsToSort.map(f => EffortField.enum2Field(f).comparingFn));

		const rows = efforts
			.sort(comparatorSuper)
			.map(e => {
				const cells = [];
				cells.push(this.toLink(e));
				fieldsToRender.forEach(f => {
					const field = EffortField.enum2Field(f);
					cells.push(field.renderFn(e));
				});
				return cells;
			});
		return await this.dvRenderer.table(headers, rows);
	}

	private createHeader(textContent: string, level: number) {
		const header = document.createElement(`h${level}`);
		header.textContent = textContent;
		return header;
	}
}

export enum EffortFieldEnum {
	AREA = "AREA",
	STATUS = "STATUS",
	VOTES = "VOTES"
}

export class EffortField {
	public field: keyof Effort;
	public renderFn: (effort: Effort) => string;
	public comparingFn: ComparingFn<Effort>;

	static enum2Field(field: EffortFieldEnum): EffortField {
		switch (field) {
			case EffortFieldEnum.AREA:
				return {
					field: "area",
					renderFn: (e) => {
						return e.getRelatedArea()?.title ?? "--";
					},
					comparingFn: Comparator.comparing((e: Effort) => e.getRelatedArea()?.getParentsCount() ?? 99)
				};
			case EffortFieldEnum.STATUS:
				return {
					field: "status",
					renderFn: (e) => {
						return e.status;
					},
					comparingFn: EffortStatusComparator.compare
				}
			case EffortFieldEnum.VOTES:
				return {
					field: "votes",
					renderFn: (e) => {
						return `${e.getVotes()}`;
					},
					comparingFn: Comparator.reverse(Comparator.comparing((e: Effort) => e.getVotes()))
				}
		}
	}
}
