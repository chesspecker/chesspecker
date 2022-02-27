import {RefreshIcon} from '@heroicons/react/solid';
import {useAtom} from 'jotai';
import {orientationAtom} from '@/lib/atoms';

const Flip = () => {
	const [, setOrientation] = useAtom(orientationAtom);
	const handleClick = () => {
		setOrientation(state => (state === 'white' ? 'black' : 'white'));
	};

	return (
		<button
			type='button'
			className='cursor-pointer bg-transparent'
			onClick={handleClick}
		>
			<RefreshIcon className='h-5 w-5' />
		</button>
	);
};

export default Flip;
