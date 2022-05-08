import {CogIcon} from '@heroicons/react/solid';
import Modal from 'react-pure-modal';
import {memo} from 'react';
import AutoMoveSettings from './auto-move';
import BoardSettings from './board';
import PiecesSettings from './pieces';
import SoundSettings from './sound';
import useModal from '@/hooks/use-modal';

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

			<Modal header='Settings' isOpen={isOpen} onClose={hide}>
				<div className='grid items-center grid-cols-2 gap-3 text-sm'>
					<SoundSettings />
					<BoardSettings />
					<PiecesSettings />
					<AutoMoveSettings />
				</div>
			</Modal>
		</>
	);
};

export default memo(Settings);
