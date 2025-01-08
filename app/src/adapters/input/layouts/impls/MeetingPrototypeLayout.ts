import ExoContext from "../../../../../../common/ExoContext";
import DvRenderer from "../../../../utils/dv/DvRenderer";
import AbstractLayout from "./AbstractLayout";
import MeetingPrototype from "../../../../../../core/src/domain/ems/meeting/MeetingPrototype";
import Meeting from "../../../../../../core/src/domain/ems/meeting/Meeting";
import CreateMeeting from "../../actions/no-context/domain/CreateMeeting";

export default class MeetingPrototypeLayout extends AbstractLayout<MeetingPrototype> {

	constructor(ctx: ExoContext, dvRenderer: DvRenderer) {
		super(ctx, dvRenderer);
	}

	async render(ko: MeetingPrototype, el: HTMLElement): Promise<void> {
		await this.renderCreateImplementationButton(el);
		await this.handleUnresolvedImplementations(ko, el);
	}

	private async renderCreateImplementationButton(el: HTMLElement) {
		const button = this.createButton("Create implementation", async () => {
			let createMeetingAction = new CreateMeeting(this.ctx);
			await createMeetingAction.execute();
		});

		el.appendChild(button);
	}

	private async handleUnresolvedImplementations(ko: MeetingPrototype, el: HTMLElement) {
		const impls: Meeting[] = await this.ctx.meetingRepository.find(m => {
			if (m.isResolved()) {
				return false;
			}
			return m.prototype !== null && m.prototype.id === ko.id;
		});

		if (impls.length === 0) {
			return;
		}

		el.appendChild(this.createH1("Unresolved implementations"));
		let div = await this.dvRenderer.listKOs(impls.slice(0, 50));
		el.appendChild(div)
	}
}
