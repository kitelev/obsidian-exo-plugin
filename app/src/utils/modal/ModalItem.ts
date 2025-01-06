import ModalItemsFolder from "./ModalItemsFolder";
import ExoAction from "../../adapters/input/actions/ExoAction";

export interface ModalItem {
	name: string;

	visit(visitor: ModalItemVisitor): Promise<void>;
}

export interface ModalItemVisitor {
	visitFolder(folder: ModalItemsFolder): Promise<void>;

	visitAction(action: ExoAction): Promise<void>;
}
