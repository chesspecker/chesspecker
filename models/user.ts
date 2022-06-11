import {getModelForClass, prop, mongoose} from '@typegoose/typegoose';
import type {AchievementItem, Streak, ThemeItem} from '@/types/models';

export class User {
	@prop()
	public _id: mongoose.Types.ObjectId;

	@prop()
	public id: string;

	@prop()
	public stripeId: string;

	@prop()
	public username: string;

	@prop()
	public isSponsor: boolean;

	// FIXME: This is a hack to get the type to work.
	@prop()
	public validatedAchievements: AchievementItem[];

	@prop()
	public totalPuzzleSolved: number;

	@prop()
	public totalSetCompleted: number;

	@prop()
	public totalTimePlayed: number;

	@prop()
	public streak: Streak;

	// FIXME: This is a hack to get the type to work.
	@prop()
	public puzzleSolvedByCategories: ThemeItem[];
}

const UserModel = getModelForClass(User);
export default UserModel;
