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
	streak: {
		currentCount: Number,
		startDate: String, // 11/11/2019
		lastLoginDate: String, // 14/11/2019
	},
	totalTimePlayed: Number,
	puzzleSolvedByCategories: [{title: String, count: Number}],
});

export default models.User || model<UserInterface>('User', schema);
