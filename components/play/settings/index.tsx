import {CogIcon} from '@heroicons/react/solid';
import {memo} from 'react';
import AutoMoveSettings from './auto-move';
import BoardSettings from './board';
import PiecesSettings from './pieces';
import SoundSettings from './sound';
import useModal from '@/hooks/use-modal';
import GenericModal from '@/components/modal';

const Settings = () => {
	const {isOpen, hide, toggle} = useModal(false);
	return (
		<>
			<button
				type='button'
				className='bg-transparent cursor-pointer'
				onClick={toggle}
			>
				<CogIcon className='w-5 h-5' />
			</button>
			<GenericModal title='Settings' hide={hide} isOpen={isOpen}>
				<div className='grid items-center grid-cols-2 gap-3 text-sm mt-5'>
					<SoundSettings />
					<BoardSettings />
					<PiecesSettings />
					<AutoMoveSettings />
				</div>
			</GenericModal>
		</>
	);
};

export default memo(Settings);
