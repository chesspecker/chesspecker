import {Dispatch, memo, SetStateAction, useEffect, useState} from 'react';
import {Button} from '../button';
import useTimer from '@/hooks/use-timer';

type Props = {
	time: number;
	answer: string;
	isComplete: boolean;
	solution: boolean;
	setSolution: Dispatch<SetStateAction<boolean>>;
};

const Solution = ({time, answer, isComplete, solution, setSolution}: Props) => {
	const {timer, updateTimer} = useTimer(time - time);
	const [isPastis, setIsPastis] = useState(false);

	const handleClick = () => {
		setSolution(() => true);
	};

	useEffect(() => {
		updateTimer(time - time);
	}, [time]);

	/**
	 * Wait to show solution button.
	 */
	useEffect(() => {
		if (timer < 6) setIsPastis(() => false);
		if (timer >= 6) setIsPastis(() => true);
	}, [timer]);

	if (!isPastis)
		return (
			<div>
				{!isPastis && (
					<div className='block w-36 cursor-pointer self-center rounded-md border-none bg-gray-500 py-2 text-center font-merriweather text-lg font-bold leading-8 text-white'>
						NO CHEATING
					</div>
				)}
			</div>
		);

	return (
		<div>
			{!solution && !isComplete && (
				<Button
					className='block w-36 cursor-pointer self-center rounded-md border-none bg-gray-500 py-2 text-center font-merriweather text-lg font-bold leading-8 text-white'
					onClick={handleClick}
				>
					VIEW SOLUTION
				</Button>
			)}
			{solution && !isComplete && (
				<span className='text-lg font-bold text-white'>{answer}</span>
			)}
		</div>
	);
};

export default memo(Solution);
