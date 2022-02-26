import {Schema, model, models} from 'mongoose';
import type {Document} from 'mongoose';

export interface UserInterface extends Document {
	_id: string;
	id: string;
	username: string;
	url: string;
	averageRating: number;
	puzzleSet: any[];
}

const schema = new Schema<UserInterface>({
	id: String,
	username: String,
	url: String,
	averageRating: Number,
	puzzleSet: [{type: Schema.Types.ObjectId, ref: 'PuzzleSet'}],
});

export default models.User || model<UserInterface>('User', schema);
