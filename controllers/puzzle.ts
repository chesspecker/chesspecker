import Puzzle, {PuzzleInterface} from '@/models/puzzle-model';

export const create = async (
	body: PuzzleInterface,
): Promise<PuzzleInterface> => {
	const puzzle: PuzzleInterface = new Puzzle(body);
	return puzzle.save();
};

export const retrieve = async (
	id: PuzzleInterface['id'],
): Promise<PuzzleInterface> => Puzzle.findById(id).exec();

export const update = async (
	id: PuzzleInterface['id'],
	body: Partial<PuzzleInterface>,
): Promise<PuzzleInterface> =>
	Puzzle.findByIdAndUpdate(id, body, {new: true}).exec();

export const remove = async (
	id: PuzzleInterface['id'],
): Promise<PuzzleInterface> => Puzzle.findByIdAndDelete(id).exec();
