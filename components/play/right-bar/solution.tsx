import {memo, useEffect} from 'react';
import {useAtom} from 'jotai';
import {Button} from '../../button';
import useTimer from '@/hooks/use-timer';
import {playµ} from '@/lib/atoms';

type Props = {answer: string};

const defaultClasses =
	'mx-auto md:mx-2 w-36 rounded-md bg-slate-800 dark:bg-white leading-8 mt-0 ml-2 font-bold font-sans text-sm md:text-lg px-2.5 py-2';
const disabledClasses = `block cursor-default text-white dark:text-sky-800 self-center border border-none border-transparent text-center shadow-sm ${defaultClasses}`;

const Solution = ({answer}: Props) => {
	const [isSolutionClicked, setIsSolutionClicked] = useAtom(playµ.solution);
	const [time] = useAtom(playµ.timer);
	const [isComplete] = useAtom(playµ.isComplete);
	const {timer, updateTimer} = useTimer(time - time);

	useEffect(() => {
		updateTimer(time - time);
	}, [time, updateTimer]);

	if (timer.value < 6)
		return <div className={disabledClasses}>SOLUTION IN {6 - timer.value}</div>;

	if (isComplete)
		return (
			<Button
				className={disabledClasses}
				onClick={() => {
					('');
				}}
			>
				VIEW SOLUTION
			</Button>
		);

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
