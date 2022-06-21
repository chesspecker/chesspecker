import MoveToNext from './move-to-next';
import Progress from './progress';
import Solution from './solution';
import {Puzzle} from '@/models/puzzle';

type Props = {
	answer: string;
	fen: string;
	puzzle?: Puzzle;
	hasSpacedRepetition: boolean;
	changePuzzle: () => void;
	launchTimer: () => void;
};

const RightBar = ({
	answer,
	fen,
	puzzle,
	changePuzzle,
	launchTimer,
	hasSpacedRepetition,
}: Props) => {
	if (!puzzle)
		return (
			<div className='flex invisible md:w-36 md:mx-2 md:flex-col h-48'></div>
		);
	return (
		<div className='flex flex-row justify-center w-5/6 md:w-fit md:flex-col'>
			<div className='mt-2'>
				<Progress hasSpacedRepetition={hasSpacedRepetition} />
			</div>
			<div className='h-48 mt-2'>
				<Solution answer={answer} fen={fen} puzzle={puzzle} />
				<MoveToNext changePuzzle={changePuzzle} launchTimer={launchTimer} />
			</div>
		</div>
	);
};

export default RightBar;
