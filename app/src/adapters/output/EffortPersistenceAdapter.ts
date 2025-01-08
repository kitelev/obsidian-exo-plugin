import EffortRepository from "../../../../core/src/ports/output/EffortRepository";
import Effort from "../../../../core/src/domain/ems/effort/Effort";
import ExoContext from "../../../../common/ExoContext";
import KObject from "../../../../core/src/domain/KObject";
import DateUtils from "../../../../common/utils/DateUtils";
import AbstractPersistenceAdapter from "./AbstractPersistenceAdapter";

export default class EffortPersistenceAdapter extends AbstractPersistenceAdapter<Effort> implements EffortRepository {
	constructor(ctx: ExoContext) {
		super(ctx, Effort.CLASS);
	}

	async save(effort: Effort): Promise<void> {
		const folderPath: string = this.ctx.effortPathRulesHelper.getEffortFolderPath(effort)
		const filePath = folderPath + "/" + effort.title + ".md";
		const fileContent = this.serialize(effort);

		await this.ctx.appUtils.createFile(filePath, fileContent);
	}

	async update(effort: Effort): Promise<void> {
		const file = this.ctx.appUtils.getObjectFileOrThrow(effort);
		const data = this.serialize(effort);
		await this.ctx.appUtils.updateFile(file, data);
	}

	private serialize(effort: Effort) {
		let result = "";
		result += "---\n";
		result += "tags:\n";
		result += " - EMS/Effort\n";
		result += "uid: " + effort.id + "\n";
		result += "e-status: " + effort.status + "\n";
		if (effort.started) {
			result += "started: " + DateUtils.formatTimestamp(effort.started) + "\n";
		}
		if (effort.ended) {
			result += "ended: " + DateUtils.formatTimestamp(effort.ended) + "\n";
		}
		if (effort.prototype) {
			result += "e-prototype: \'" + this.getLinkToKO(effort.prototype) + "\'\n";
		}
		if (effort.area) {
			result += "area: \'" + this.getLinkToArea(effort.area) + "\'\n";
		}
		if (effort.parent) {
			result += "e-parent: \'" + this.getLinkToEffort(effort.parent) + "\'\n";
		}
		result += "---\n";
		result += effort.body;
		return result;
	}

	private getLinkToKO(ko: KObject): string {
		let file = this.ctx.appUtils.getObjectFileOrThrow(ko);
		return `[[${file.basename}]]`; // TODO replace with ko.title
	}
}
