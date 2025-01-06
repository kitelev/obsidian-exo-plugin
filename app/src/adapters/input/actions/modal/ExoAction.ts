import ExoContext from "../../../../../../common/ExoContext";

export default interface ExoAction {
	name: string;

	execute(ctx: ExoContext): Promise<void>;
}
