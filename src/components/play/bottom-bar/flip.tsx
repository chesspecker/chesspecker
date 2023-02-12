import {ArrowPathIcon} from '@heroicons/react/24/solid';
import {useAtom} from 'jotai';
import {memo} from 'react';
import {orientationµ} from '@/atoms/play';

const Flip = () => {
	const [, setOrientation] = useAtom(orientationµ.color);
	const [, setIsReverted] = useAtom(orientationµ.reverted);
	const handleClick = () => {
		setIsReverted(previous => !previous);
		setOrientation(state => (state === 'white' ? 'black' : 'white'));
	};

	return (
		<button
			type='button'
			className='cursor-pointer bg-transparent'
			onClick={handleClick}
		>
			<ArrowPathIcon className='h-5 w-5' />
		</button>
	);
};

// eslint-disable-next-line import/no-default-export
export default memo(Flip);
