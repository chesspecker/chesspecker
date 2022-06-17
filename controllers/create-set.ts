/* eslint-disable unicorn/no-array-callback-reference,
unicorn/no-array-method-this-argument */
import {mongoose} from '@typegoose/typegoose';
import {safeZero, shuffle} from '@/lib/utils';
import PuzzleModel, {Puzzle} from '@/models/puzzle';
import PuzzleSetModel, {PuzzleSet} from '@/models/puzzle-set';
import UserModel, {User} from '@/models/user';
import {Theme} from '@/data/themes';
import {Difficulty} from '@/types/models';

export type Options = {
	title: PuzzleSet['title'];
	themeArray: Array<Theme['id']>;
	size: PuzzleSet['length'];
	level: PuzzleSet['level'];
	averageRating: PuzzleSet['rating'];
};

const rating = (
	level: PuzzleSet['level'],
	averageRating = 1500,
): [number, number] => {
	switch (level) {
		case 'easiest':
			return [safeZero(averageRating - 600), safeZero(averageRating - 500)];

		case 'easier':
			return [safeZero(averageRating - 300), safeZero(averageRating - 200)];

		case 'harder':
			return [averageRating + 200, averageRating + 300];

		case 'hardest':
			return [averageRating + 500, averageRating + 600];

		case 'normal':
		default:
			return [averageRating - 50, averageRating + 50];
	}
};

const createFilter =
	(themeArray: string[], minRating: number, maxRating: number) =>
	(spread: number): mongoose.FilterQuery<any> =>
		themeArray.includes('healthyMix')
			? {Rating: {$gt: minRating - spread, $lt: maxRating + spread}}
			: {
					$and: [
						{Rating: {$gt: minRating - spread, $lt: maxRating + spread}},
						{Themes: {$in: [...themeArray]}},
					],
			  };

export const create = async (
	userID: User['id'],
	options: Options,
): Promise<PuzzleSet> => {
	const setLevel = options.level || Difficulty.normal;
	const [minRating, maxRating] = rating(setLevel, options.averageRating);

	const projection = {_id: 1, PuzzleId: 1, Rating: 1};
	const getFilter = createFilter(options.themeArray, minRating, maxRating);

	const searchDb = async (
		spread: number,
	): Promise<mongoose.FilterQuery<any>> => {
		const filter_: mongoose.FilterQuery<any> = getFilter(spread);
		if (spread > 250) return filter_;
		const possibleDocs = await PuzzleModel.countDocuments(filter_)
			.limit(options.size)
			.exec();

		if (possibleDocs < options.size) return searchDb(spread + 5);
		return filter_;
	};

	const filter = await searchDb(0);

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

	const unshuffledPuzzles = await PuzzleModel.find(filter, projection)
		.limit(options.size)
		.lean()
		.exec();

	if (unshuffledPuzzles.length === 0) throw new Error('No puzzles found');
	const unformattedPuzzles = shuffle(unshuffledPuzzles);
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
	puzzleSet.level = setLevel;
	return puzzleSet.save();
};
