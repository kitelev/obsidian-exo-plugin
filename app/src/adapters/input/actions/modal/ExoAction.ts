import ExoContext from "../../../../../../common/ExoContext";

export default interface ExoAction {
	name: string;
	slug: string; // TODO delete

	execute(ctx: ExoContext): Promise<void>;
}
