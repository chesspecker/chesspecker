import {memo} from 'react';
import useClock from '@/hooks/use-clock';

const Timer = ({value}) => {
	const [days, hours, minutes, seconds] = useClock(value);
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
