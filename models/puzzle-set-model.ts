import {Schema, model, models, Types} from 'mongoose';
import type {Document} from 'mongoose';
import {PuzzleInterface} from './puzzle-model';

export type Difficulty =
	| 'easiest'
	| 'easier'
	| 'easy'
	| 'normal'
	| 'intermediate'
	| 'hard'
	| 'harder'
	| 'hardest';

export interface PuzzleItemInterface {
	_id: Types.ObjectId;
	PuzzleId: PuzzleInterface['PuzzleId'];
	played: boolean;
	count: number;
	streak: number;
	order: number;
	mistakes: number[];
	timeTaken: number[];
	grades: number[];
}

export interface PuzzleSetInterface extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	puzzles: PuzzleItemInterface[];
	title: string;
	length: number;
	cycles: number;
	spacedRepetition: boolean;
	currentTime: number;
	times: number[];
	rating: number;
	progression: number;
	level: Difficulty;
}

const schema = new Schema<PuzzleSetInterface>({
	user: {type: 'ObjectId', ref: 'User'},
	puzzles: [
		{
			_id: {type: 'ObjectId', ref: 'Puzzle'},
			PuzzleId: {type: String},
			played: {type: Boolean, default: false},
			count: {type: Number},
			streak: {type: Number},
			order: {type: Number},
			mistakes: {type: [Number]},
			timeTaken: {type: [Number]},
			grades: {type: [Number]},
		},
	],
	title: {type: String},
	length: {type: Number},
	cycles: {type: Number},
	spacedRepetition: {type: Boolean},
	currentTime: {type: Number},
	times: {type: [Number]},
	rating: {type: Number},
	progression: {type: Number},
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
