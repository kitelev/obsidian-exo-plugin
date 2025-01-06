import ExoContext from "../../../../../common/ExoContext";
import {ModalItem} from "../../../utils/modal/ModalItem";

export default interface ExoAction extends ModalItem {
	name: string;

	execute(ctx: ExoContext): Promise<void>;
}
