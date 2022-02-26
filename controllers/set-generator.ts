/* eslint-disable unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument */
import {shuffle} from '@/lib/help-array';
import PuzzleSet, {PuzzleSetInterface} from '@/models/puzzle-set-model';
import Puzzle from '@/models/puzzle-model';
import {UserInterface} from '@/models/user-model';
import {Theme} from '@/data/themes';

const rating = (
	averageRating: UserInterface['averageRating'],
	level: PuzzleSetInterface['level'],
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
	themeArray: any,
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

type options = {
	title: PuzzleSetInterface['title'];
	themeArray: Array<Theme['id']>;
	size: PuzzleSetInterface['length'];
	level: PuzzleSetInterface['level'];
};

export default async function setGenerator(
	user: UserInterface,
	options: options,
): Promise<PuzzleSetInterface> {
	const puzzleSet = new PuzzleSet();
	const setLevel = options.level || 'normal';
	const [minRating, maxRating] = rating(user.averageRating, setLevel);
	puzzleSet.user = user._id;
	puzzleSet.puzzles = [];
	let puzzlesCount = 0;

	const iterateCursor = async query => {
		const cursor = await Puzzle.find(query, {_id: 1, PuzzleId: 1}).exec();
		const docArray = shuffle(cursor);
		for (const doc of docArray) {
			if (puzzlesCount >= options.size) break;
			const puzzleToInsert = {
				_id: doc._id,
				PuzzleId: doc.PuzzleId,
				played: false,
				order: puzzlesCount,
				mistakes: 0,
				timeTaken: 0,
				grade: 0,
				repetition: 0,
				interval: 0,
				easinessFactor: 2.5,
			};
			puzzleSet.puzzles.push(puzzleToInsert);
			puzzlesCount++;
		}
	};

	let spread = 0;
	do {
		const query = getQuery(options.themeArray, minRating, maxRating, spread);
		try {
			await iterateCursor(query);
		} catch (error) {
			throw error;
		}

		spread += 25;
	} while (puzzlesCount < options.size);

	puzzleSet.length = puzzlesCount;
	puzzleSet.chunkLength = Math.round(puzzlesCount / 6);
	puzzleSet.title = options.title;
	puzzleSet.cycles = 0;
	puzzleSet.spacedRepetition = false;
	puzzleSet.currentTime = 0;
	puzzleSet.bestTime = 0;
	puzzleSet.rating = user.averageRating;
	puzzleSet.totalMistakes = 0;
	puzzleSet.totalPuzzlesPlayed = 0;
	puzzleSet.accuracy = 1;
	puzzleSet.level = setLevel;
	return puzzleSet;
}
