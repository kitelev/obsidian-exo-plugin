import Layout from "../Layout";
import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import KObject from "../../../../../../core/src/domain/KObject";

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

	private createHeader(textContent: string, level: number) {
		const header = document.createElement(`h${level}`);
		header.textContent = textContent;
		return header;
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
			return e.relates.some(r => r.id === ko.id);
		});

		if (efforts.length > 0) {
			el.appendChild(this.createH1("Related efforts"));
			let div = await this.dvRenderer.listKOs(efforts);
			el.appendChild(div);
		}
	}
}
