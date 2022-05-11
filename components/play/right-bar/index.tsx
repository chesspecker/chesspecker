import MoveToNext from './move-to-next';
import Progress from './progress';
import Solution from './solution';

type Props = {
	answer: string;
	hasSpacedRepetition: boolean;
	changePuzzle: () => void;
	launchTimer: () => void;
};

const RightBar = ({
	answer,
	changePuzzle,
	launchTimer,
	hasSpacedRepetition,
}: Props) => {
	return (
		<div className='flex flex-row justify-center w-5/6 md:w-fit md:flex-col'>
			<div className='mt-2'>
				<Progress hasSpacedRepetition={hasSpacedRepetition} />
			</div>
			<div className='mt-2'>
				<Solution answer={answer} />
				<MoveToNext changePuzzle={changePuzzle} launchTimer={launchTimer} />
			</div>
		</div>
	);
};

export default RightBar;
