import PuzzleSet, {PuzzleSetInterface} from '@/models/puzzle-set-model';
import {UserInterface} from '@/models/user-model';

export {create} from '@/controllers/set-create';

export const retrieve = async (
	id: PuzzleSetInterface['id'],
): Promise<PuzzleSetInterface> =>
	PuzzleSet.findById(id).exec() as Promise<PuzzleSetInterface>;

export const retrieveByUser = async (
	user: UserInterface['id'],
): Promise<PuzzleSetInterface[]> =>
	PuzzleSet.find({user}).exec() as Promise<PuzzleSetInterface[]>;

export const update = async (
	id: PuzzleSetInterface['id'],
	timeTaken: number,
): Promise<PuzzleSetInterface> => {
	const update = {
		$inc: {
			cycles: 1,
		},
		$push: {
			times: timeTaken,
		},
		$set: {
			'puzzles.$[].played': false,
			currentTime: 0,
			progression: 0,
		},
	};

	return PuzzleSet.findByIdAndUpdate(id, update, {
		new: true,
	}).exec() as Promise<PuzzleSetInterface>;
};

export const remove = async (
	id: PuzzleSetInterface['id'],
): Promise<PuzzleSetInterface> =>
	PuzzleSet.findByIdAndDelete(id).exec() as Promise<PuzzleSetInterface>;
