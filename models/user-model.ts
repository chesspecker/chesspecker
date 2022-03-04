import {Schema, model, models, Types} from 'mongoose';
import type {Document} from 'mongoose';

export interface UserInterface extends Document {
	_id: Types.ObjectId;
	id: string;
	lichessId: string;
	username: string;
	url: string;
	permissionLevel: number;
	lastUpdatedAt: number;
	isSponsor: boolean;
	perfs: {
		ultraBullet: {games: number; rating: number};
		bullet: {games: number; rating: number};
		blitz: {games: number; rating: number};
		rapid: {games: number; rating: number};
		classical: {games: number; rating: number};
		correspondence: {games: number; rating: number};
		puzzle: {games: number; rating: number};
	};
	puzzleSet: any[];
}

const schema = new Schema<UserInterface>({
	id: String,
	username: String,
	url: String,
	permissionLevel: Number,
	lastUpdatedAt: Date,
	isSponsor: Boolean,
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
