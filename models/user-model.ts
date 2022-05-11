import {Schema, model, models} from 'mongoose';
import {UserInterface} from '@/types/models';

const schema = new Schema<UserInterface>({
	id: String,
	lichessId: String,
	stripeId: String,
	username: String,
	isSponsor: Boolean,
	validatedAchievements: [
		{
			id: String,
			claimed: Boolean,
			date: Date,
		},
	],
	totalPuzzleSolved: Number,
	totalSetCompleted: Number,
	totalTimePlayed: Number,
	streak: {
		currentCount: Number,
		startDate: String, // 11/11/2019
		lastLoginDate: String, // 14/11/2019
	},
	puzzleSolvedByCategories: [{title: String, count: Number}],
});

export default models.User || model<UserInterface>('User', schema);
