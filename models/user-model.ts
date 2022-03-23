import {Schema, model, models} from 'mongoose';
import {UserInterface} from './types';

const schema = new Schema<UserInterface>({
	id: String,
	username: String,
	url: String,
	permissionLevel: Number,
	lastUpdatedAt: Date,
	isSponsor: Boolean,
	validatedAchievements: [
		{
			id: String,
			claimed: Boolean,
		},
	],
	perfs: {
		ultraBullet: {games: Number, rating: Number},
		bullet: {games: Number, rating: Number},
		blitz: {games: Number, rating: Number},
		rapid: {games: Number, rating: Number},
		classical: {games: Number, rating: Number},
		correspondence: {games: Number, rating: Number},
		puzzle: {games: Number, rating: Number},
	},
	puzzleSet: [{type: Schema.Types.ObjectId, ref: 'PuzzleSet'}],
});

export default models.User || model<UserInterface>('User', schema);
