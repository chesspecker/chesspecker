import User, {UserInterface} from '@/models/user-model';

export const createFromLichess = async (body: any): Promise<UserInterface> => {
	const parameters = {
		id: body.id,
		username: body.username,
		url: body.url,
		averageRating: 1500,
	};

	if (!body.perfs) {
		const user: UserInterface = new User(parameters);
		return user.save();
	}

	const perfs: number[] = [];
	for (const key in body.perfs) {
		if (body.perfs[key]) {
			for (let i = 0; i < body.perfs[key].games; i++) {
				perfs.push(body.perfs[key].rating);
			}
		}
	}

	parameters.averageRating = perfs.reduce((a, b) => a + b, 0) / perfs.length;
	const user: UserInterface = new User(parameters);
	return user.save();
};

export const create = async (body: UserInterface): Promise<UserInterface> => {
	const user: UserInterface = new User(body);
	return user.save();
};

export const retrieve = async (
	id: UserInterface['id'],
): Promise<UserInterface> => User.findById(id).exec();

export const update = async (
	id: UserInterface['id'],
	body: Partial<UserInterface>,
): Promise<UserInterface> =>
	User.findByIdAndUpdate(id, body, {new: true}).exec();

export const remove = async (id: UserInterface['id']): Promise<UserInterface> =>
	User.findByIdAndDelete(id).exec();
