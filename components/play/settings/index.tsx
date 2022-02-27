import {CogIcon} from '@heroicons/react/solid';
import Modal from 'react-pure-modal';
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
				className='cursor-pointer bg-transparent'
				onClick={toggle}
			>
				<CogIcon className='h-5 w-5' />
			</button>

			<Modal header='Settings' isOpen={isOpen} onClose={hide}>
				<div className='grid grid-cols-2 items-center gap-3 text-sm'>
					<SoundSettings />
					<BoardSettings />
					<PiecesSettings />
					<AutoMoveSettings />
				</div>
			</Modal>
		</>
	);
};

export default Settings;
