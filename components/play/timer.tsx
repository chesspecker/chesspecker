import {memo, useEffect} from 'react';
import useClock from '@/hooks/use-clock';
import useTimer from '@/hooks/use-timer';

const Timer = ({value}) => {
	const {timer, updateTimer} = useTimer(0);
	const [days, hours, minutes, seconds] = useClock(timer);

	useEffect(() => {
		updateTimer(timer);
	}, [value]);
	console.log(seconds);

	return (
		<div className='text-white'>
			{days > 0 && <span>{days}&space;:&space;</span>}
			{hours > 0 && <span>{hours}&space;:&space;</span>}
			<span>{minutes} : </span>
			<span>{seconds}</span>
		</div>
	);
};

export default memo(Timer);
