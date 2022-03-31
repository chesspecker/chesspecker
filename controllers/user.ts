import {UpdateQuery} from 'mongoose';
import {LichessUser} from '@/types/lichess';
import User from '@/models/user-model';
import type {UserInterface} from '@/models/types';

export const create = async (liUser: LichessUser): Promise<UserInterface> => {
	const parameters: Partial<UserInterface> = {
		id: liUser.id,
		username: liUser.username,
		url: liUser.url,
	};

	if (!liUser.perfs) {
		const user: UserInterface = new User(parameters) as UserInterface;
		return user.save();
	}

	const perfs: number[] = [];
	for (const key in liUser.perfs) {
		if (liUser.perfs[key]) {
			for (let i = 0; i < liUser.perfs[key].games; i++) {
				perfs.push(liUser.perfs[key].rating);
			}
		}
	}

	const user: UserInterface = new User(parameters) as UserInterface;
	return user.save();
};

export const retrieve = async (
	id: UserInterface['id'],
): Promise<UserInterface> => User.findById(id).exec() as Promise<UserInterface>;

export const update = async (
	id: UserInterface['id'],
	body: UpdateQuery<Partial<UserInterface>>,
): Promise<UserInterface> =>
	User.findByIdAndUpdate(id, body, {
		new: true,
	}).exec() as Promise<UserInterface>;

export const remove = async (id: UserInterface['id']): Promise<UserInterface> =>
	User.findByIdAndDelete(id).exec() as Promise<UserInterface>;
