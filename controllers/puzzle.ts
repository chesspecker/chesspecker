import Puzzle from '@/models/puzzle-model';
import PuzzleSet from '@/models/puzzle-set-model';
import type {
	PuzzleInterface,
	PuzzleItemInterface,
	PuzzleSetInterface,
} from '@/types/models';

export const create = async (
	body: PuzzleInterface,
): Promise<PuzzleInterface> => {
	const puzzle: PuzzleInterface = new Puzzle(body) as PuzzleInterface;
	return puzzle.save();
};

export const retrieve = async (
	id: PuzzleInterface['id'],
): Promise<PuzzleInterface> =>
	Puzzle.findById(id).exec() as Promise<PuzzleInterface>;

export const update = async (
	puzzleId: PuzzleItemInterface['_id'],
	body: {_id: PuzzleItemInterface; update: Partial<PuzzleItemInterface>},
): Promise<PuzzleItemInterface> =>
	PuzzleSet.findOneAndUpdate(
		{_id: body._id, 'puzzles._id': puzzleId},
		body.update,
		{new: true},
	)
		.exec()
		.then((set: PuzzleSetInterface) =>
			set.puzzles.find(
				(item: PuzzleItemInterface) =>
					item._id.toString() === puzzleId.toString(),
			),
		);

export const remove = async (
	id: PuzzleInterface['id'],
): Promise<PuzzleInterface> =>
	Puzzle.findByIdAndDelete(id).exec() as Promise<PuzzleInterface>;
