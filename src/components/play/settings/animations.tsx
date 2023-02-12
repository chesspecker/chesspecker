import {useAtom} from 'jotai';
import {configµ} from '@/atoms/chessground';

export const AnimationsSettings = () => {
	const [animation, setAnimation] = useAtom(configµ.animation);
	return (
		<>
			<span>Show animations</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='rounded border border-gray-300'
					defaultChecked={animation}
					onChange={() => {
						setAnimation((state: boolean) => !state);
					}}
				/>
			</div>
		</>
	);
};
