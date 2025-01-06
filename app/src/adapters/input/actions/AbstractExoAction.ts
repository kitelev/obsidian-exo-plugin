import ExoAction from "./ExoAction";
import {ModalItemVisitor} from "../../../utils/modal/actions/ModalItem";
import ExoContext from "../../../../../common/ExoContext";

export default abstract class AbstractExoAction implements ExoAction {
	name: string;

	abstract execute(ctx: ExoContext): Promise<void>;

	async visit(param: ModalItemVisitor): Promise<void> {
		await param.visitAction(this);
	}
}
