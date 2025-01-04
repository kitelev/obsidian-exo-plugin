import Layout from "./Layout";
import ExoContext from "../../../../../common/ExoContext";
import DvRenderer from "../../../utils/dv/DvRenderer";
import KObject from "../../../../../core/src/domain/KObject";

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

	protected toLink(ko: KObject) {
		const file = this.ctx.appUtils.getObjectFileOrThrow(ko);
		return this.ctx.dvApiHolder.dvApi.fileLink(file.path);
	}

	private createHeader(textContent: string, level: number) {
		const header = document.createElement(`h${level}`);
		header.textContent = textContent;
		return header;
	}
}
