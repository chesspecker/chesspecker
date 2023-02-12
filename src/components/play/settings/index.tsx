import {CogIcon} from '@heroicons/react/24/solid';
import {memo} from 'react';
import GenericModal from '@/components/modal';
import {useModal} from '@/hooks/use-modal';
import {BoardSettings} from '@/components/play/settings/board';
import {PiecesSettings} from '@/components/play/settings/pieces';
import {SoundSettings} from '@/components/play/settings/sound';
import {AnimationsSettings} from '@/components/play/settings/animations';
import {AutoMoveSettings} from '@/components/play/settings/auto-move';
import {ClockSettings} from '@/components/play/settings/clock';

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

// eslint-disable-next-line import/no-default-export
export default memo(Settings);
