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

export const create = async (
	userID: UserInterface['id'],
	options: Options,
): Promise<PuzzleSetInterface> => {
	const setLevel = options.level || 'normal';
	const [minRating, maxRating] = rating(setLevel, options.averageRating);

	let filter: FilterQuery<any> = {};
	const projection = {_id: 1, PuzzleId: 1, Rating: 1};

	const loop = async (spread: number) => {
		if (spread > 1500) return;

		filter = getFilter(options.themeArray, minRating, maxRating, spread);
		const possibleDocs = await Puzzle.countDocuments(filter)
			.limit(options.size)
			.exec();
		if (possibleDocs >= options.size) return;

		spread += 10;
		await loop(spread);
	};

	await loop(0);

	const puzzles = (await Puzzle.find(filter, projection)
		.limit(options.size)
		.lean()
		.exec()) as PuzzleInterface[];

	const shuffledPuzzles = shuffle(puzzles);
	const handlePuzzle = (puzzle: PuzzleInterface, index: number) => {
		const puzzleToInsert: PuzzleItemInterface = {
			_id: puzzle._id,
			PuzzleId: puzzle.PuzzleId,
			played: false,
			count: 0,
			streak: 0,
			order: index,
			mistakes: [],
			timeTaken: [],
			grades: [],
		};
		return {puzzle: puzzleToInsert, rating: puzzle.Rating};
	};

	const results = shuffledPuzzles.map((puzzle, index) =>
		handlePuzzle(puzzle, index),
	);

	const puzzleSet: PuzzleSetInterface = new PuzzleSet() as PuzzleSetInterface;
	puzzleSet.puzzles = [];
	let futurePuzzleSetRating = 0;

	for (const {puzzle, rating} of results) {
		puzzleSet.puzzles.push(puzzle);
		futurePuzzleSetRating += rating;
	}

	const userQuery = User.findById(userID);
	const user: UserInterface = (await userQuery.exec()) as UserInterface;

	puzzleSet.user = user._id;
	puzzleSet.length = shuffledPuzzles.length;
	puzzleSet.title = options.title;
	puzzleSet.spacedRepetition = false;
	puzzleSet.cycles = 0;
	puzzleSet.currentTime = 0;
	puzzleSet.times = [];
	puzzleSet.rating = Math.round(futurePuzzleSetRating / shuffledPuzzles.length);
	puzzleSet.progress = 0;
	puzzleSet.level = setLevel;
	return puzzleSet.save();
};
