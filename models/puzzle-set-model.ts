import {Schema, model, models} from 'mongoose';
import type {Document} from 'mongoose';
import {UserInterface} from './user-model';

type difficulty =
	| 'easiest'
	| 'easier'
	| 'easy'
	| 'normal'
	| 'intermediate'
	| 'hard'
	| 'harder'
	| 'hardest';

export interface PuzzleSetInterface extends Document {
	_id: string;
	user: UserInterface;
	puzzles: Array<{
		_id: string;
		PuzzleId: string;
		played: boolean;
		order: number;
		mistakes: number;
		timeTaken: number;
		grade: number;
		interval: number;
		repetition: number;
		easinessFactor: number;
	}>;
	title: string;
	length: number;
	chunkLength: number;
	cycles: number;
	spacedRepetition: boolean;
	currentTime: number;
	bestTime: number;
	rating: number;
	totalMistakes: number;
	totalPuzzlesPlayed: number;
	accuracy: number;
	level: difficulty;
}

const schema = new Schema<PuzzleSetInterface>({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	puzzles: [
		{
			_id: {type: Schema.Types.ObjectId, ref: 'Puzzle'},
			PuzzleId: {type: String},
			played: {type: Boolean},
			order: {type: Number},
			mistakes: {type: Number},
			timeTaken: {type: Number},
			grade: {type: Number},
			interval: {type: Number},
			repetition: {type: Number},
			easinessFactor: {type: Number},
		},
	],
	title: {type: String},
	length: {type: Number},
	chunkLength: {type: Number},
	cycles: {type: Number},
	spacedRepetition: {type: Boolean},
	currentTime: {type: Number},
	bestTime: {type: Number},
	rating: {type: Number},
	totalMistakes: {type: Number},
	totalPuzzlesPlayed: {type: Number},
	accuracy: {type: Number},
	level: {
		type: String,
		enum: [
			'easiest',
			'easier',
			'easy',
			'normal',
			'intermediate',
			'hard',
			'harder',
			'hardest',
		],
		default: 'normal',
	},
});

export default models.PuzzleSet ||
	model<PuzzleSetInterface>('PuzzleSet', schema);
