import {mongoose, prop} from '@typegoose/typegoose';

export class PuzzleItem {
	@prop()
	public _id: mongoose.Types.ObjectId;

	@prop()
	public PuzzleId: string;

	@prop()
	public played: boolean;

	@prop()
	public count: number;

	@prop()
	public streak: number;

	@prop()
	public order: number;

	@prop({type: () => [Number]})
	public mistakes: number[];

	@prop({type: () => [Number]})
	public timeTaken: number[];

	@prop({type: () => [Number]})
	public grades: number[];
}
