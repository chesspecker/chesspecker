import PuzzleSet, {
	PuzzleItemInterface,
	PuzzleSetInterface,
} from '@/models/puzzle-set-model';

type BodyData = {
	_id: PuzzleSetInterface['id'];
	didCheat: boolean;
	mistakes: number;
	timeTaken: number;
	perfect: number;
};

const getGrade = ({didCheat, mistakes, timeTaken, perfect}: BodyData) => {
	if (didCheat || mistakes >= 3) return 1;
	if (mistakes === 2 || (mistakes === 1 && timeTaken >= 20)) return 2;
	if (mistakes === 1 || timeTaken >= 20) return 3;
	if (timeTaken >= 6) return 4;
	if (perfect < 2) return 5;
	return 6;
};

export const update = async (
	puzzleId: PuzzleItemInterface['_id'],
	body: BodyData,
): Promise<PuzzleSetInterface> => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {_id, mistakes, timeTaken} = body;
	return PuzzleSet.findOneAndUpdate(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		{_id, 'puzzles._id': puzzleId},
		{
			$inc: {
				'puzzles.$.count': 1,
				currentTime: timeTaken + 3 * mistakes,
				totalMistakes: mistakes,
				totalPuzzlesPlayed: 1,
			},
			$push: {
				'puzzles.$.mistakes': mistakes,
				'puzzles.$.timeTaken': timeTaken,
				'puzzles.$.grades': getGrade(body),
			},
		},
		{new: true},
	).exec() as Promise<PuzzleSetInterface>;
};
