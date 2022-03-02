/* eslint-disable unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument */
import {shuffle} from '@/lib/help-array';
import Puzzle, {PuzzleInterface} from '@/models/puzzle-model';
import PuzzleSet, {
	PuzzleItemInterface,
	PuzzleSetInterface,
} from '@/models/puzzle-set-model';
import User, {UserInterface} from '@/models/user-model';
import {Theme} from '@/data/themes';

const rating = (
	level: PuzzleSetInterface['level'],
	averageRating: UserInterface['averageRating'] = 1500,
): [number, number] => {
	switch (level) {
		case 'easiest':
			return [averageRating - 600, averageRating - 500];

		case 'easier':
			return [averageRating - 300, averageRating - 200];

		case 'harder':
			return [averageRating + 200, averageRating + 300];

		case 'hardest':
			return [averageRating + 500, averageRating + 600];

		case 'normal':
		default:
			return [averageRating - 50, averageRating + 50];
	}
};

const getQuery = (
	themeArray: string[],
	minRating: number,
	maxRating: number,
	spread: number,
) =>
	themeArray.includes('healthyMix')
		? {Rating: {$gt: minRating - spread, $lt: maxRating + spread}}
		: {
				$and: [
					{Rating: {$gt: minRating - spread, $lt: maxRating + spread}},
					{Themes: {$in: [...themeArray]}},
				],
		  };

export type Options = {
	title: PuzzleSetInterface['title'];
	themeArray: Array<Theme['id']>;
	size: PuzzleSetInterface['length'];
	level: PuzzleSetInterface['level'];
};

export const create = async (
	userID: UserInterface['id'],
	options: Options,
): Promise<PuzzleSetInterface> => {
	const user: UserInterface = (await User.findById(
		userID,
	).exec()) as UserInterface;
	const puzzleSet: PuzzleSetInterface = new PuzzleSet() as PuzzleSetInterface;
	const setLevel = options.level || 'normal';
	const [minRating, maxRating] = rating(setLevel, user.averageRating);
	puzzleSet.user = user._id;
	puzzleSet.puzzles = [];
	let puzzlesCount = 0;

	const iterateCursor = async query => {
		const cursor = (await Puzzle.find(query, {
			_id: 1,
			PuzzleId: 1,
		}).exec()) as PuzzleInterface[];
		const docArray = shuffle(cursor);
		for (const doc of docArray) {
			if (puzzlesCount >= options.size) break;
			const puzzleToInsert: PuzzleItemInterface = {
				_id: doc._id,
				PuzzleId: doc.PuzzleId,
				played: false,
				count: 0,
				order: puzzlesCount,
				mistakes: [],
				timeTaken: [],
				grades: [],
			};
			puzzleSet.puzzles.push(puzzleToInsert);
			puzzlesCount++;
		}
	};

	let spread = 0;
	do {
		const query = getQuery(options.themeArray, minRating, maxRating, spread);
		try {
			// eslint-disable-next-line no-await-in-loop
			await iterateCursor(query);
		} catch (error: unknown) {
			const error_ = error as Error;
			throw error_;
		}

		spread += 25;
	} while (puzzlesCount < options.size);

	puzzleSet.length = puzzlesCount;
	puzzleSet.title = options.title;
	puzzleSet.spacedRepetition = false;
	puzzleSet.currentTime = 0;
	puzzleSet.bestTime = 0;
	puzzleSet.rating = user.averageRating;
	puzzleSet.totalMistakes = 0;
	puzzleSet.totalPuzzlesPlayed = 0;
	puzzleSet.level = setLevel;
	return puzzleSet.save();
};
