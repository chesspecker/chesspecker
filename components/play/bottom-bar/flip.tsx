import {RefreshIcon} from '@heroicons/react/solid';
import {useAtom} from 'jotai';
import {memo} from 'react';
import {orientationµ, revertedµ} from '@/lib/atoms';

const Flip = () => {
	const [, setOrientation] = useAtom(orientationµ);
	const [, setIsReverted] = useAtom(revertedµ);
	const handleClick = () => {
		setIsReverted(previous => !previous);
		setOrientation(state => (state === 'white' ? 'black' : 'white'));
	};

	return (
		<button
			type='button'
			className='bg-transparent cursor-pointer'
			onClick={handleClick}
		>
			<RefreshIcon className='w-5 h-5' />
		</button>
	);
};

export default memo(Flip);
