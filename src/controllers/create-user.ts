import UserModel, {User} from '@/models/user';
import {formattedDate} from '@/lib/utils';
import {LichessUser} from '@/types/lichess';
import {ChesscomUser} from '@/types/chesscom';

export const createChesscomUser = async (chUser: ChesscomUser) => {
	const parameters: Partial<User> = {
		id: chUser.username,
		username: chUser.username,
	};

	const user = new UserModel(parameters);
	return user.save();
};

export const createLichessUser = async (liUser: LichessUser) => {
	const today = formattedDate(new Date());
	const parameters: Partial<User> = {
		id: liUser.id,
		username: liUser.username,
		stripeId: undefined,
		isSponsor: false,
		validatedAchievements: [],
		totalPuzzleSolved: 0,
		totalSetCompleted: 0,
		totalTimePlayed: 0,
		streak: {
			currentCount: 0,
			startDate: today,
			lastLoginDate: today,
		},
		puzzleSolvedByCategories: [],
	};
	const user = new UserModel(parameters);
	return user.save();
};
