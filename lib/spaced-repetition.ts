import {update_} from './api-helpers';
import {PuzzleSet} from '@/models/puzzle-set';

const getTerminatedUpdate = () => ({
	$set: {
		'puzzles.$[].played': false,
		currentTime: 0,
		progress: 0,
		spacedRepetition: false,
	},
	$inc: {
		cycles: 0,
	},
});

const getActivatedUpdate = (puzzleSet: PuzzleSet) => {
	const puzzleOrder = [];
	const chunks: Record<number, number> = {};
	for (let i = 0; i <= 6; i++) chunks[i] = puzzleSet.length * i + 1;
	for (let index = 0; index < puzzleSet.length; index++) {
		const grades = puzzleSet.puzzles[index].grades;
		const lastGrade = grades.length > 0 ? grades[grades.length - 1] : 3;
		chunks[lastGrade]++;
		puzzleOrder.push(chunks[lastGrade]);
	}

	// prettier-ignore
	const update = [
		{
			'$set': {
				progress: 0,
				spacedRepetition: true,
				puzzles: {
					'$map': {
						input: {
							'$range': [0, '$length'],
						},
						in: {
							'$mergeObjects': [
								{
									'$arrayElemAt': ['$puzzles', '$$this'],
								},
								{
									played: false,
									order: {
										'$arrayElemAt': [puzzleOrder, '$$this'],
									},
								},
							],
						},
					},
				},
			},
		},
	];

	return update;
};

/**
 * Handle spaced-repetition.
 */
export const updateSpacedRep = async (
	set: PuzzleSet,
	showSpacedOff: () => void,
) => {
	const areAllPerfect = set.puzzles
		.map(puzzle => puzzle.grades[puzzle.grades.length - 1])
		.flat(Number.POSITIVE_INFINITY)
		.every(grade => grade >= 4);

	if (areAllPerfect) {
		const update = getTerminatedUpdate();
		update.$inc.cycles = 1;
		await update_.set(set._id.toString(), update).catch(console.error);
		showSpacedOff();
		return;
	}

	const update = getActivatedUpdate(set);
	await update_.set(set._id.toString(), update).catch(console.error);
};

export const activateSpacedRep = async (set: PuzzleSet) => {
	const update = getActivatedUpdate(set);
	await update_.set(set._id.toString(), update).catch(console.error);
};

export const deactivateSpacedRep = async (set: PuzzleSet) => {
	const update = getTerminatedUpdate();
	await update_.set(set._id.toString(), update).catch(console.error);
};
