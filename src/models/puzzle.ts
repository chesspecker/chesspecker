import type {mongoose} from '@typegoose/typegoose';
import {getModelForClass, prop, index} from '@typegoose/typegoose';

@index({PuzzleId: 1}, {unique: true})
export class Puzzle {
	@prop()
	public PuzzleId!: string;

	@prop()
	public FEN!: string;

	@prop()
	public Moves!: string;

	@prop()
	public Rating!: number;

	@prop()
	public RatingDeviation!: number;

	@prop()
	public Popularity!: number;

	@prop()
	public NbPlays!: number;

	@prop({type: () => [String]})
	public Themes!: string[];

	@prop()
	public GameUrl!: string;

	_id!: mongoose.Types.ObjectId;
}

const PuzzleModel = getModelForClass(Puzzle);
export default PuzzleModel;
