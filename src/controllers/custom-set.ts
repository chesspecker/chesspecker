/* eslint-disable unicorn/no-array-callback-reference */
import {shuffle} from '@/lib/utils';
import PuzzleModel, {Puzzle} from '@/models/puzzle';
import PuzzleSetModel, {PuzzleSet} from '@/models/puzzle-set';
import UserModel, {User} from '@/models/user';
import {Activity} from '@/types/lichess';
import {Difficulty} from '@/types/models';

const nonNullable = <T>(value: T): value is NonNullable<T> =>
	value !== null && value !== undefined;

export type Options = {
	title: PuzzleSet['title'];
};

export const create = async (
	userID: User['id'],
	list: Activity,
	options: Options,
): Promise<PuzzleSet> => {
	const format = (list: Puzzle[]) =>
		list.map((doc: Puzzle, index: number) => ({
			puzzle: {
				_id: doc._id,
				PuzzleId: doc.PuzzleId,
				played: false,
				count: 0,
				streak: 0,
				order: index,
				mistakes: [],
				timeTaken: [],
				grades: [],
			},
			rating: doc.Rating,
		}));

	const puzzlesArray = list.map(async puzzle => {
		return PuzzleModel.findOne({PuzzleId: puzzle.id}).lean().exec();
	});

	const unshuffledPuzzles = await Promise.all(puzzlesArray);
	if (unshuffledPuzzles.length === 0) throw new Error('No puzzles found');
	const unformattedPuzzles = shuffle(unshuffledPuzzles.filter(nonNullable));
	const puzzles = format(unformattedPuzzles);

	const user = await UserModel.findById(userID).lean().exec();
	if (!user) throw new Error('No user found');
	const puzzleSet = new PuzzleSetModel();
	const avgRating = puzzles.reduce((acc, curr) => acc + curr.rating, 0);

	puzzleSet.puzzles = puzzles.map(({puzzle}) => puzzle);
	puzzleSet.rating = Math.round(avgRating / puzzles.length);
	puzzleSet.user = user._id;
	puzzleSet.length = puzzles.length;
	puzzleSet.title = options.title;
	puzzleSet.spacedRepetition = false;
	puzzleSet.cycles = 0;
	puzzleSet.currentTime = 0;
	puzzleSet.times = [];
	puzzleSet.progress = 0;
	puzzleSet.level = 'normal' as Difficulty;
	return puzzleSet.save();
};
