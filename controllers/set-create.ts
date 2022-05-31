/* eslint-disable unicorn/no-array-callback-reference,
unicorn/no-array-method-this-argument,
@typescript-eslint/consistent-type-assertions */
import {FilterQuery} from 'mongoose';
import {safeZero, shuffle} from '@/lib/utils';
import Puzzle from '@/models/puzzle-model';
import PuzzleSet from '@/models/puzzle-set-model';
import User from '@/models/user-model';
import {Theme} from '@/data/themes';
import type {
	UserInterface,
	PuzzleInterface,
	PuzzleItemInterface,
	PuzzleSetInterface,
} from '@/types/models';

export type Options = {
	title: PuzzleSetInterface['title'];
	themeArray: Array<Theme['id']>;
	size: PuzzleSetInterface['length'];
	level: PuzzleSetInterface['level'];
	averageRating: PuzzleSetInterface['rating'];
};

const rating = (
	level: PuzzleSetInterface['level'],
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
	(spread: number): FilterQuery<any> =>
		themeArray.includes('healthyMix')
			? {Rating: {$gt: minRating - spread, $lt: maxRating + spread}}
			: {
					$and: [
						{Rating: {$gt: minRating - spread, $lt: maxRating + spread}},
						{Themes: {$in: [...themeArray]}},
					],
			  };

export const create = async (
	userID: UserInterface['id'],
	options: Options,
): Promise<PuzzleSetInterface> => {
	const setLevel = options.level || 'normal';
	const [minRating, maxRating] = rating(setLevel, options.averageRating);

	const projection = {_id: 1, PuzzleId: 1, Rating: 1};
	const getFilter = createFilter(options.themeArray, minRating, maxRating);

	const searchDb = async (spread: number): Promise<FilterQuery<any>> => {
		const filter_: FilterQuery<any> = getFilter(spread);
		if (spread > 250) return filter_;
		const possibleDocs = await Puzzle.countDocuments(filter_)
			.limit(options.size)
			.exec();

		if (possibleDocs < options.size) return searchDb(spread + 5);
		return filter_;
	};

	const filter = await searchDb(0);

	const format = (list: PuzzleInterface[]) =>
		list.map((doc: PuzzleInterface, index: number) => ({
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
			} as PuzzleItemInterface,
			rating: doc.Rating,
		}));

	const unshuffledPuzzles = (await Puzzle.find(filter, projection)
		.limit(options.size)
		.lean()
		.exec()) as PuzzleInterface[];

	const unformattedPuzzles = shuffle(unshuffledPuzzles);
	const puzzles = format(unformattedPuzzles);

	const userQuery = User.findById(userID);
	const user: UserInterface = (await userQuery.exec()) as UserInterface;
	const puzzleSet: PuzzleSetInterface = new PuzzleSet() as PuzzleSetInterface;
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
