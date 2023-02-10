import {CogIcon} from '@heroicons/react/solid';
import {memo} from 'react';
import AutoMoveSettings from './auto-move';
import BoardSettings from './board';
import PiecesSettings from './pieces';
import SoundSettings from './sound';
import ClockSettings from './clock';
import AnimationsSettings from './animations';
import GenericModal from '@/components/modal';
import useModal from '@/hooks/use-modal';

const Settings = () => {
	const {isOpen, hide, toggle} = useModal(false);
	return (
		<>
			<button
				type='button'
				className='cursor-pointer bg-transparent'
				onClick={toggle}
			>
				<CogIcon className='h-5 w-5' />
			</button>
			<GenericModal title='Settings' hide={hide} isOpen={isOpen}>
				<div className='mt-5 grid grid-cols-2 items-center gap-3 text-sm'>
					<BoardSettings />
					<PiecesSettings />
					<AutoMoveSettings />
					<SoundSettings />
					<ClockSettings />
					<AnimationsSettings />
				</div>
			</GenericModal>
		</>
	);
};

export default memo(Settings);
