import {Dispatch, memo, SetStateAction, useCallback, useEffect} from 'react';
import {Button} from '../button';
import useTimer from '@/hooks/use-timer';

type Props = {
	time: number;
	answer: string;
	isComplete: boolean;
	isSolutionClicked: boolean;
	setSolution: Dispatch<SetStateAction<boolean>>;
};

const Solution = ({
	time,
	answer,
	isComplete,
	isSolutionClicked,
	setSolution,
}: Props) => {
	const {timer, updateTimer} = useTimer(time - time);

	const handleClick = useCallback(() => {
		setSolution(() => true);
	}, [setSolution]);

	useEffect(() => {
		updateTimer(time - time);
	}, [time, updateTimer]);

	if (timer.value < 6)
		return (
			<div>
				<div className='block w-36 cursor-pointer self-center rounded-md border-none bg-gray-500 py-2 text-center font-merriweather text-lg font-bold leading-8 text-white'>
					NO CHEATING
				</div>
			</div>
		);

	if (isComplete) return null;

	if (isSolutionClicked)
		return <span className='text-lg font-bold text-white'>{answer}</span>;
	return (
		<div>
			<Button
				className='block w-36 cursor-pointer self-center rounded-md border-none bg-gray-500 py-2 text-center font-merriweather text-lg font-bold leading-8 text-white'
				onClick={handleClick}
			>
				VIEW SOLUTION
			</Button>
		</div>
	);
};

export default memo(Solution);
