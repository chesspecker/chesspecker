import {update as update_} from './play';
import {PuzzleSetInterface} from '@/types/models';

/**
 * Handle spaced-repetition.
 */
export const updateSpacedRepetition = async (
	set: PuzzleSetInterface,
	showSpacedOff = () => {
		('');
	},
) => {
	const puzzleOrder = [];
	const chunks = {};

	const areAllPerfect = set.puzzles
		.map(puzzle => puzzle.grades)
		.flat(Number.POSITIVE_INFINITY)
		.every(grade => grade >= 5);

	if (areAllPerfect) {
		const update = {
			$set: {
				'puzzles.$[].played': false,
				currentTime: 0,
				progression: 0,
				spacedRepetition: false,
			},
		};

		// @ts-expect-error to create a mongoose update type
		await update_.set(set._id.toString(), update).catch(console.error);

		showSpacedOff();
		return;
	}

	for (let i = 0; i <= 6; i++) chunks[i] = set.length * i + 1;

	for (let index = 0; index < set.length; index++) {
		const grades = set.puzzles[index].grades;
		const lastGrade = grades[grades.length - 1];
		chunks[lastGrade]++;
		puzzleOrder.push(chunks[lastGrade]);
	}

	const update = {
		$set: {
			'puzzles.$[].played': false,
			puzzles: {
				$map: {
					input: {$range: [0, set.length]},
					in: {
						$mergeObject: [
							{$arrayElemAt: ['$puzzles', '$$this']},
							{order: {$arrayElemAt: [puzzleOrder, '$$this']}},
						],
					},
				},
			},
		},
	};

	// @ts-expect-error Need to create a mongoose update type
	await update_.set(set._id.toString(), update).catch(console.error);
};

export const activateSpacedRepetion = async (set: PuzzleSetInterface) => {
	await updateSpacedRepetition(set);
	const update = {$set: {spacedRepetition: true}};
	// @ts-expect-error to create a mongoose update type
	await update_.set(set._id.toString(), update).catch(console.error);
};
