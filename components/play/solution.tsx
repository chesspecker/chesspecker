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

const defaultClasses =
	'mx-auto md:mx-2 w-36 rounded-md bg-gray-800 text-white leading-8';
const disabledClasses = `block cursor-default self-center border border-none border-transparent bg-opacity-70 px-2.5 py-2 text-center font-merriweather text-lg font-bold shadow-sm ${defaultClasses}`;

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
		return <div className={disabledClasses}>NO CHEATING</div>;

	if (isComplete) return null;

	if (isSolutionClicked)
		return <span className={disabledClasses}>{answer}</span>;

	return (
		<Button className={defaultClasses} onClick={handleClick}>
			VIEW SOLUTION
		</Button>
	);
};

export default memo(Solution);
