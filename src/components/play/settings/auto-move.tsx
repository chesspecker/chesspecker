import {useAtom} from 'jotai';
import {configµ} from '@/atoms/chessground';

export const AutoMoveSettings = () => {
	const [autoMove, setAutoMove] = useAtom(configµ.autoMove);
	return (
		<>
			<span>Jump to next puzzle immediately</span>
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
