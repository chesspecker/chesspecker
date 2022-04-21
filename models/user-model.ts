import {Schema, model, models} from 'mongoose';
import {UserInterface} from './types';

const schema = new Schema<UserInterface>({
	id: String,
	lichessId: String,
	username: String,
	url: String,
	isSponsor: Boolean,
	validatedAchievements: [
		{
			id: String,
			claimed: Boolean,
		},
	],
	totalPuzzleSolved: Number,
	totalSetCompleted: Number,
	lastVisit: Date,
	streakDays: Number,
	totalTimePlayed: Number,
	puzzleSolvedByCategories: {id: String, totalPuzzleSolved: Number},
});

export default models.User || model<UserInterface>('User', schema);
