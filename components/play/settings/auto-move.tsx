import {useAtom} from 'jotai';
import {autoMoveAtom} from '@/lib/atoms';

const AutoMoveSettings = () => {
	const [autoMove, setAutoMove] = useAtom(autoMoveAtom);
	return (
		<>
			<span>Auto move to next puzzle</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='rounded border border-gray-300'
					defaultChecked={autoMove}
					onChange={() => {
						setAutoMove((state: boolean) => !state);
					}}
				/>
			</div>
		</>
	);
};

export default AutoMoveSettings;
