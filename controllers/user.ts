import {LichessUser} from '@/types/lichess';
import User, {UserInterface} from '@/models/user-model';
import {ChesscomUser} from '@/types/chesscom';

export const createChesscomUser = async (
	chUser: ChesscomUser,
): Promise<UserInterface> => {
	const parameters: Partial<UserInterface> = {
		id: chUser.username,
		username: chUser.username,
		url: chUser.url,
	};

	const user: UserInterface = new User(parameters) as UserInterface;
	return user.save();
};

export const createLichessUser = async (
	liUser: LichessUser,
): Promise<UserInterface> => {
	const parameters: Partial<UserInterface> = {
		id: liUser.id,
		username: liUser.username,
		url: liUser.url,
	};

	const user: UserInterface = new User(parameters) as UserInterface;
	return user.save();
};

export const retrieve = async (
	id: UserInterface['id'],
): Promise<UserInterface> => User.findById(id).exec() as Promise<UserInterface>;

export const update = async (
	id: UserInterface['id'],
	body: Partial<UserInterface>,
): Promise<UserInterface> =>
	User.findByIdAndUpdate(id, body, {
		new: true,
	}).exec() as Promise<UserInterface>;

export const remove = async (id: UserInterface['id']): Promise<UserInterface> =>
	User.findByIdAndDelete(id).exec() as Promise<UserInterface>;
