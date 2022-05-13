import {useAtom} from 'jotai';
import {configµ} from '@/lib/atoms';

const AutoMoveSettings = () => {
	const [hasClock, setHasClock] = useAtom(configµ.hasClock);
	return (
		<>
			<span>Display timer</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='border border-gray-300 rounded'
					defaultChecked={hasClock}
					onChange={() => {
						setHasClock((state: boolean) => !state);
					}}
				/>
			</div>
		</>
	);
};

export default AutoMoveSettings;
