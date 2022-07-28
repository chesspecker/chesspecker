import {prop} from '@typegoose/typegoose';

export class Streak {
	@prop()
	public currentCount!: number;

	@prop()
	public startDate!: string;

	@prop()
	public lastLoginDate!: string;
}
