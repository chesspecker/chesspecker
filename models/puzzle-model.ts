import {Schema, model, models} from 'mongoose';

export interface PuzzleInterface {
	_id: string;
	PuzzleId: string;
	FEN: string;
	Moves: string;
	Rating: number;
	RatingDeviation: number;
	Popularity: number;
	NbPlays: number;
	Themes: string[];
	GameUrl: string;
}

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
