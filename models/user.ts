import {getModelForClass, prop, mongoose} from '@typegoose/typegoose';
import {ThemeItem} from './theme';
import {AchievementItem} from './achievement';
import {Streak} from './streak';

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

	@prop({type: () => [AchievementItem]})
	public validatedAchievements: AchievementItem[];

	@prop()
	public totalPuzzleSolved: number;

	@prop()
	public totalSetCompleted: number;

	@prop()
	public totalTimePlayed: number;

	@prop({type: () => Streak})
	public streak: Streak;

	@prop({type: () => [ThemeItem]})
	public puzzleSolvedByCategories: ThemeItem[];
}

const UserModel = getModelForClass(User);
export default UserModel;
