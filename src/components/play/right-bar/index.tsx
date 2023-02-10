import MoveToNext from './move-to-next';
import Progress from './progress';
import Solution from './solution';
import type {Puzzle} from '@/models/puzzle';

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
		return <div className='invisible flex h-48 md:mx-2 md:w-36 md:flex-col' />;
	return (
		<div className='flex w-5/6 flex-row justify-center md:w-fit md:flex-col'>
			<div className='mt-2'>
				<Progress hasSpacedRepetition={hasSpacedRepetition} />
			</div>
			<div className='mt-2 h-48'>
				<Solution answer={answer} fen={fen} puzzle={puzzle} />
				<MoveToNext changePuzzle={changePuzzle} launchTimer={launchTimer} />
			</div>
		</div>
	);
};

export default RightBar;
