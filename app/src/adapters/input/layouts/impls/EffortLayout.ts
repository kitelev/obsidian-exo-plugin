import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import Effort from "../../../../../../core/src/domain/ems/effort/Effort";
import {EffortStatusComparator} from "../../../../../../core/src/domain/ems/effort/EffortStatus";
import Comparator from "../../../../../../common/Comparator";
import AbstractLayout from "./AbstractLayout";
import {Notice} from "obsidian";

export default class EffortLayout extends AbstractLayout<Effort> {
	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: Effort, el: HTMLElement): Promise<void> {
		await this.showAvailableActions(ko, el);
		await this.handleChildren(ko, el);
		await this.handleRelatedEfforts(ko, el);
	}

	protected createButton(text: string, onClick: () => Promise<void>): HTMLButtonElement {
		const button = document.createElement("button");
		button.textContent = text;
		button.style.marginRight = "5px";
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

	private async showAvailableActions(effort: Effort, el: HTMLElement) {
		const startButton = this.createButton("Start", async () => {
			await this.ctx.effortCommandFactory.createStartEffortCommand().execute(effort);
			new Notice("Effort started");
		});
		el.appendChild(startButton);

		const endButton = this.createButton("End", async () => {
			await this.ctx.effortCommandFactory.createEndEffortCommand().execute(effort);
			new Notice("Effort ended");
		});
		el.appendChild(endButton);
	}

	private async handleChildren(ko: Effort, el: HTMLElement) {
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

		return await this.dvRenderer.table(headers, rows);
	}
}
