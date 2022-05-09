import {memo, useEffect} from 'react';
import {useAtom} from 'jotai';
import {Button} from '../../button';
import useTimer from '@/hooks/use-timer';
import {playµ} from '@/lib/atoms';

type Props = {answer: string};

const defaultClasses =
	'mx-auto md:mx-2 w-36 rounded-md bg-slate-800 dark:bg-slate-100  leading-8';
const disabledClasses = `block cursor-default self-center border border-none border-transparent bg-opacity-70 px-2.5 py-2 text-center font-sans text-sm md:text-lg font-bold shadow-sm ${defaultClasses}`;

const Solution = ({answer}: Props) => {
	const [isSolutionClicked, setIsSolutionClicked] = useAtom(playµ.solution);
	const [time] = useAtom(playµ.timer);
	const [isComplete] = useAtom(playµ.isComplete);
	const {timer, updateTimer} = useTimer(time - time);

	useEffect(() => {
		updateTimer(time - time);
	}, [time, updateTimer]);

	if (timer.value < 6)
		return <div className={disabledClasses}>NO CHEATING</div>;

	if (isComplete) return null;

	if (isSolutionClicked)
		return <span className={disabledClasses}>{answer}</span>;

	return (
		<Button
			className={defaultClasses}
			onClick={() => {
				setIsSolutionClicked(() => true);
			}}
		>
			VIEW SOLUTION
		</Button>
	);
};

export default memo(Solution);
