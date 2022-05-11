import {useAtom} from 'jotai';
import {configµ} from '@/lib/atoms';

const SoundSettings = () => {
	const [sound, setSound] = useAtom(configµ.sound);
	return (
		<>
			<span>Sound effects</span>
			<div className='flex'>
				<input
					type='checkbox'
					className='border border-gray-300 rounded'
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
