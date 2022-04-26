import {Schema, model, models} from 'mongoose';
import {PuzzleSetInterface} from './types';

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
