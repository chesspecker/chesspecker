import {useAtom} from 'jotai';
import {configµ} from '@/atoms/chessground';

export const ClockSettings = () => {
	const [hasClock, setHasClock] = useAtom(configµ.hasClock);
	return (
		<>
			<span>Display timer</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='rounded border border-gray-300'
					defaultChecked={hasClock}
					onChange={() => {
						setHasClock((state: boolean) => !state);
					}}
				/>
			</div>
		</>
	);
};
