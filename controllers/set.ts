import PuzzleSet, {PuzzleSetInterface} from '@/models/puzzle-set-model';
import setGenerator from '@/controllers/set-generator';
import User, {UserInterface} from '@/models/user-model';
import {Theme} from '@/data/themes';

type options = {
	title: PuzzleSetInterface['title'];
	themeArray: Array<Theme['id']>;
	size: PuzzleSetInterface['length'];
	level: PuzzleSetInterface['level'];
};

export const create = async (
	userID: UserInterface['id'],
	body: options,
): Promise<PuzzleSetInterface> => {
	const user: UserInterface = await User.findById(userID).exec();
	const puzzleSet: PuzzleSetInterface = await setGenerator(user, body);
	return puzzleSet.save();
};

export const retrieve = async (
	id: PuzzleSetInterface['id'],
): Promise<PuzzleSetInterface> => PuzzleSet.findById(id).exec();

export const retrieveByUser = async (
	id: PuzzleSetInterface['id'],
): Promise<PuzzleSetInterface> => PuzzleSet.findOne({user: id}).exec();

export const update = async (
	id: PuzzleSetInterface['id'],
	body: Partial<PuzzleSetInterface>,
): Promise<PuzzleSetInterface> =>
	PuzzleSet.findByIdAndUpdate(id, body, {new: true}).exec();

export const remove = async (
	id: PuzzleSetInterface['id'],
): Promise<PuzzleSetInterface> => PuzzleSet.findByIdAndDelete(id).exec();
