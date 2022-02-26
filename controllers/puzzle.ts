import Puzzle, {PuzzleInterface} from '@/models/puzzle-model';

export {update} from '@/controllers/puzzle-update';

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

export const remove = async (
	id: PuzzleInterface['id'],
): Promise<PuzzleInterface> =>
	Puzzle.findByIdAndDelete(id).exec() as Promise<PuzzleInterface>;
