import {getModelForClass, prop, mongoose} from '@typegoose/typegoose';

export class Puzzle {
	@prop()
	public _id: mongoose.Types.ObjectId;

	@prop()
	public PuzzleId: string;

	@prop()
	public FEN: string;

	@prop()
	public Moves: string;

	@prop()
	public Rating: string;

	@prop()
	public RatingDeviation: number;

	@prop()
	public Popularity: number;

	@prop()
	public NbPlays: number;

	@prop({type: () => [String]})
	public Themes: string[];

	@prop()
	public GameUrl: string;
}

const PuzzleModel = getModelForClass(Puzzle);
export default PuzzleModel;
