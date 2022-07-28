import {useAtom} from 'jotai';
import {configµ} from '@/lib/atoms';

const AutoMoveSettings = () => {
	const [animation, setAnimation] = useAtom(configµ.animation);
	return (
		<>
			<span>Show animations</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='border border-gray-300 rounded'
					defaultChecked={animation}
					onChange={() => {
						setAnimation((state: boolean) => !state);
					}}
				/>
			</div>
		</>
	);
};

export default AutoMoveSettings;
