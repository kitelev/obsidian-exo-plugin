import ExoContext from "../../../../../common/ExoContext";
import KObject from "../../../../../core/src/domain/KObject";

export default class AbstractSerde<KO extends KObject> {
	constructor(protected ctx: ExoContext) {
	}

	protected serializeKoSpecificProps(ko: KO): string {
		return "";
	}

	private serialize(ko: KO) {
		let result = "";
		result += "---\n";
		result += "tags:\n";
		result += ` - ${ko.koc}\n`;
		result += "uid: " + ko.id + "\n";
		result += this.serializeKoSpecificProps(ko);
		result += "---\n";
		result += ko.body;
		return result;
	}
}
