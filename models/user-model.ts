import {Schema, model, models, Types} from 'mongoose';
import type {Document} from 'mongoose';

export interface UserInterface extends Document {
	_id: Types.ObjectId;
	id: string;
	username: string;
	url: string;
	averageRating: number;
	puzzleSet: Types.ObjectId[];
}

const schema = new Schema<UserInterface>({
	id: String,
	username: String,
	url: String,
	averageRating: Number,
	puzzleSet: [{type: 'ObjectId', ref: 'PuzzleSet'}],
});

export default models.User || model<UserInterface>('User', schema);
