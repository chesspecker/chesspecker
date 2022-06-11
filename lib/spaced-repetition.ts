import {update as update_} from './play';
import {PuzzleSet} from '@/models/puzzle-set';

const getTerminatedUpdate = () => ({
	$set: {
		'puzzles.$[].played': false,
		currentTime: 0,
		progress: 0,
		spacedRepetition: false,
	},
});

const getActivatedUpdate = (puzzleSet: PuzzleSet) => {
	const puzzleOrder = [];
	const chunks = {};

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
export const updateSpacedRepetition = async (
	set: PuzzleSet,
	showSpacedOff = () => null,
) => {
	const areAllPerfect = set.puzzles
		.map(puzzle => puzzle.grades[puzzle.grades.length - 1])
		.flat(Number.POSITIVE_INFINITY)
		.every(grade => grade >= 5);

	if (areAllPerfect) {
		const update = getTerminatedUpdate();
		// eslint-disable-next-line @typescript-eslint/dot-notation
		update['$inc'].cycles = 1;
		await update_.set(set._id.toString(), update).catch(console.error);
		showSpacedOff();
		return;
	}

	const update = getActivatedUpdate(set);
	await update_.set(set._id.toString(), update).catch(console.error);
};

export const activateSpacedRepetion = async (set: PuzzleSet) => {
	const update = getActivatedUpdate(set);
	await update_.set(set._id.toString(), update).catch(console.error);
};

export const turnOffSpacedRepetition = async (set: PuzzleSet) => {
	const update = getTerminatedUpdate();
	await update_.set(set._id.toString(), update).catch(console.error);
};
