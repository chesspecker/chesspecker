import {useAtom} from 'jotai';
import {soundAtom} from '@/lib/atoms';

const SoundSettings = () => {
	const [sound, setSound] = useAtom(soundAtom);
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

export default SoundSettings;
