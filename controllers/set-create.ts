/* eslint-disable unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument */
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
} from '@/models/types';

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

const getFilter = (
	themeArray: string[],
	minRating: number,
	maxRating: number,
	spread: number,
): FilterQuery<any> =>
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
	averageRating: PuzzleSetInterface['rating'];
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
	const [minRating, maxRating] = rating(setLevel, options.averageRating);
	puzzleSet.user = user._id;
	puzzleSet.puzzles = [];
	let puzzlesCount = 0;

	let futurePuzzleSetRating = 0;
	const iterateCursor = async (filter: FilterQuery<any>) => {
		const cursor = (await Puzzle.find(filter, {
			_id: 1,
			PuzzleId: 1,
			Rating: 1,
		}).exec()) as PuzzleInterface[];
		const docArray = shuffle(cursor);
		for (const doc of docArray) {
			if (puzzlesCount >= options.size) break;
			if (puzzleSet.puzzles.some(pzl => pzl._id === doc._id)) continue;
			const puzzleToInsert: PuzzleItemInterface = {
				_id: doc._id,
				PuzzleId: doc.PuzzleId,
				played: false,
				count: 0,
				streak: 0,
				order: puzzlesCount,
				mistakes: [],
				timeTaken: [],
				grades: [],
			};
			puzzleSet.puzzles.push(puzzleToInsert);
			futurePuzzleSetRating += doc.Rating;
			puzzlesCount++;
		}
	};

	let spread = 0;
	do {
		const filter = getFilter(options.themeArray, minRating, maxRating, spread);
		try {
			// eslint-disable-next-line no-await-in-loop
			await iterateCursor(filter);
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
	puzzleSet.times = [];
	puzzleSet.rating = Math.round(futurePuzzleSetRating / puzzlesCount);
	puzzleSet.progression = 0;
	puzzleSet.level = setLevel;
	return puzzleSet.save();
};
