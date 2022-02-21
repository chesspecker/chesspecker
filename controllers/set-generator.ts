/* eslint-disable unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument */
import {shuffle} from '@/lib/help-array';
import PuzzleSet from '@/models/puzzle-set-model';
import Puzzle from '@/models/puzzle-model';

const rating = (user, level) => {
	if (!user.perfs) return;
	const perf = user.perfs;
	let totalGameNumber = 1;
	const averageRating = [1500];

	if (perf.ultraBullet && perf.ultraBullet?.games > 0) {
		const ultraBulletAverage = perf.ultraBullet.rating * perf.ultraBullet.games;
		totalGameNumber += perf.ultraBullet.games;
		averageRating.push(ultraBulletAverage);
	}

	if (perf.bullet && perf.bullet?.games > 0) {
		const bulletAverage = perf.bullet.rating * perf.bullet.games;
		totalGameNumber += perf.bullet.games;
		averageRating.push(bulletAverage);
	}

	if (perf.blitz && perf.blitz?.games > 0) {
		const blitzAverage = perf.blitz.rating * perf.blitz.games;
		totalGameNumber += perf.blitz.games;
		averageRating.push(blitzAverage);
	}

	if (perf.rapid && perf.rapid?.games > 0) {
		const rapidAverage = perf.rapid.rating * perf.rapid.games;
		totalGameNumber += perf.rapid.games;
		averageRating.push(rapidAverage);
	}

	if (perf.classical && perf.classical?.games > 0) {
		const classicalAverage = perf.classical.rating * perf.classical.games;
		totalGameNumber += perf.classical.games;
		averageRating.push(classicalAverage);
	}

	if (perf.correspondance && perf.correspondance?.games > 0) {
		const correspondanceAverage =
			perf.correspondance.rating * perf.correspondance.games;
		totalGameNumber += perf.correspondance.games;
		averageRating.push(correspondanceAverage);
	}

	if (perf.puzzle && perf.puzzle?.games > 0) {
		const puzzleAverage = perf.puzzle.rating * perf.puzzle.games;
		totalGameNumber += perf.puzzle.games;
		averageRating.push(puzzleAverage);
	}

	const sum = averageRating.reduce((partialSum, a) => partialSum + a, 0);
	const ratingTier = sum / totalGameNumber;
	let minRating;
	let maxRating;
	switch (level) {
		case 'easiest':
			minRating = ratingTier - 600;
			maxRating = ratingTier - 500;
			break;
		case 'easier':
			minRating = ratingTier - 300;
			maxRating = ratingTier - 200;
			break;

		case 'harder':
			minRating = ratingTier + 200;
			maxRating = ratingTier + 300;
			break;
		case 'hardest':
			minRating = ratingTier + 500;
			maxRating = ratingTier + 600;
			break;

		case 'normal':
		default:
			minRating = ratingTier - 50;
			maxRating = ratingTier + 50;
			break;
	}

	return [minRating, maxRating, ratingTier];
};

export default async function setGenerator(user, options) {
	const puzzleSet = new PuzzleSet();
	const setLevel = options.level || 'normal';
	const [minRating, maxRating, ratingTier] = rating(user, setLevel);
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

	let query;
	if (options.themeArray.includes('healthyMix')) {
		query = {Rating: {$gt: minRating, $lt: maxRating}};
	} else {
		query = {
			$and: [
				{Rating: {$gt: minRating, $lt: maxRating}},
				{Themes: {$in: [...options.themeArray]}},
			],
		};
	}

	try {
		await iterateCursor(query);
	} catch (error) {
		throw error;
	}

	if (puzzlesCount < options.size) {
		if (options.themeArray.includes('healthyMix')) {
			query = {Rating: {$gt: minRating - 25, $lt: maxRating + 25}};
		} else {
			query = {
				$and: [
					{Rating: {$gt: minRating - 25, $lt: maxRating + 25}},
					{Themes: {$in: [...options.themeArray]}},
				],
			};
			try {
				await iterateCursor(query);
			} catch (error) {
				throw error;
			}
		}
	}

	if (puzzlesCount < options.size) {
		if (options.themeArray.includes('healthyMix')) {
			query = {Rating: {$gt: minRating - 50, $lt: maxRating + 50}};
		} else {
			query = {
				$and: [
					{Rating: {$gt: minRating - 50, $lt: maxRating + 50}},
					{Themes: {$in: [...options.themeArray]}},
				],
			};
			try {
				await iterateCursor(query);
			} catch (error) {
				throw error;
			}
		}
	}

	if (puzzlesCount < options.size) {
		if (options.themeArray.includes('healthyMix')) {
			query = {Rating: {$gt: minRating - 100, $lt: maxRating + 100}};
		} else {
			query = {
				$and: [
					{Rating: {$gt: minRating - 100, $lt: maxRating + 100}},
					{Themes: {$in: [...options.themeArray]}},
				],
			};
			try {
				await iterateCursor(query);
			} catch (error) {
				throw error;
			}
		}
	}

	puzzleSet.length = puzzlesCount;
	puzzleSet.chunkLength = Math.round(puzzlesCount / 6);
	puzzleSet.title = options.title;
	puzzleSet.cycles = 0;
	puzzleSet.spacedRepetition = false;
	puzzleSet.currentTime = 0;
	puzzleSet.bestTime = 0;
	puzzleSet.rating = ratingTier;
	puzzleSet.totalMistakes = 0;
	puzzleSet.totalPuzzlesPlayed = 0;
	puzzleSet.accuracy = 1;
	puzzleSet.level = setLevel;
	return puzzleSet;
}
