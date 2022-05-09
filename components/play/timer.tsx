import {memo, useEffect} from 'react';
import useClock from '@/hooks/use-clock';
import useTimer from '@/hooks/use-timer';

type Props = {
	value: number;
	mistakes: number;
	isRunning: boolean;
};

const Timer = ({value, mistakes, isRunning}: Props) => {
	const {timer, updateTimer, toggleTimer} = useTimer(value);
	const [days, hours, minutes, seconds] = useClock(timer.value + mistakes * 3);

	useEffect(() => {
		toggleTimer(isRunning);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [isRunning]);

	useEffect(() => {
		updateTimer(value);
	}, [value, updateTimer]);

	return (
		<div className='my-2 block w-fit min-w-[90px] cursor-default self-center rounded-md border border-transparent bg-slate-800 dark:bg-white py-2 px-2.5 text-center font-sans text-sm font-bold leading-8 text-white dark:text-sky-700 shadow-sm md:text-lg'>
			{days > 0 && <span>{`${days} : `}</span>}
			{hours > 0 && <span>{`${hours} : `}</span>}
			<span>{`0${minutes}`.slice(-2)} : </span>
			<span>{`0${seconds}`.slice(-2)}</span>
		</div>
	);
};

export default memo(Timer);
