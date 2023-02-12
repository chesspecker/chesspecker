import {useAtom} from 'jotai';
import {configµ} from '@/atoms/chessground';

export const SoundSettings = () => {
	const [sound, setSound] = useAtom(configµ.sound);
	return (
		<>
			<span>Sound effects</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='rounded border border-gray-300'
					defaultChecked={sound}
					onChange={() => {
						setSound((state: boolean) => !state);
					}}
				/>
			</div>
		</>
	);
};
