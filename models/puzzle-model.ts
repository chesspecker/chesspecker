import {Schema, model, models} from 'mongoose';
import {PuzzleInterface} from '@/types/models';

const schema = new Schema<PuzzleInterface>({
	PuzzleId: {type: String},
	FEN: {type: String},
	Moves: {type: String},
	Rating: {type: Number},
	RatingDeviation: {type: Number},
	Popularity: {type: Number},
	NbPlays: {type: Number},
	Themes: [{type: String}],
	GameUrl: {type: String},
});

export default models.Puzzle || model<PuzzleInterface>('Puzzle', schema);
