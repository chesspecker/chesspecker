import {useAtom} from 'jotai';
import {configµ} from '@/lib/atoms';

const AutoMoveSettings = () => {
	const [autoMove, setAutoMove] = useAtom(configµ.autoMove);
	return (
		<>
			<span>Auto move to next puzzle</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='border border-gray-300 rounded'
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
