import {update as update_} from './play';
import {PuzzleSetInterface} from '@/types/models';

const getTerminatedUpdate = () => ({
	$set: {
		'puzzles.$[].played': false,
		currentTime: 0,
		progression: 0,
		spacedRepetition: false,
	},
});

const getActivatedUpdate = (puzzleSet: PuzzleSetInterface) => {
	const puzzleOrder = [];
	const chunks = {};

	for (let i = 0; i <= 6; i++) chunks[i] = puzzleSet.length * i + 1;

	for (let index = 0; index < puzzleSet.length; index++) {
		const grades = puzzleSet.puzzles[index].grades;
		const lastGrade = grades.length > 0 ? grades[grades.length - 1] : 3;
		chunks[lastGrade]++;
		puzzleOrder.push(chunks[lastGrade]);
	}

	const update = {
		$set: {
			progression: 0,
			spacedRepetition: true,
			puzzles: {
				$map: {
					input: {
						$range: [0, '$length'],
					},
					in: {
						$mergeObjects: [
							{
								$arrayElemAt: ['$puzzles', '$$this'],
							},
							{
								played: false,
								order: {
									$arrayElemAt: [puzzleOrder, '$$this'],
								},
							},
						],
					},
				},
			},
		},
	};

	return update;
};

/**
 * Handle spaced-repetition.
 */
export const updateSpacedRepetition = async (
	set: PuzzleSetInterface,
	showSpacedOff = () => {
		('');
	},
) => {
	const areAllPerfect = set.puzzles
		.map(puzzle => puzzle.grades)
		.flat(Number.POSITIVE_INFINITY)
		.every(grade => grade >= 5);

	if (areAllPerfect) {
		const update = getTerminatedUpdate();
		await update_.set(set._id.toString(), update).catch(console.error);
		showSpacedOff();
		return;
	}

	const update = getActivatedUpdate(set);
	await update_.set(set._id.toString(), update).catch(console.error);
};

export const activateSpacedRepetion = async (set: PuzzleSetInterface) => {
	const update = getActivatedUpdate(set);
	await update_.set(set._id.toString(), update).catch(console.error);
};
