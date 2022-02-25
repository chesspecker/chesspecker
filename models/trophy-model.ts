import {Schema, model, models} from 'mongoose';
import type {Document} from 'mongoose';

export interface TrophyInterface extends Document {
	_id: string;
	experienceReward: number;
}

const schema = new Schema<TrophyInterface>({
	experienceReward: {type: Number},
});

export default models.Trophy || model<TrophyInterface>('Trophy', schema);
