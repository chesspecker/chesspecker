import {prop} from '@typegoose/typegoose';

export class AchievementItem {
	@prop()
	public id: string;

	@prop()
	public claimed: boolean;

	@prop()
	public date: Date;
}
