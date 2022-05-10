import {TrashIcon} from '@heroicons/react/solid';
import Modal from 'react-pure-modal';
import {memo} from 'react';
import useModal from '@/hooks/use-modal';
import {Button} from '@/components/button';

type Props = {onClick: () => Promise<void>};
const RemoveModal = ({onClick}: Props) => {
	const {isOpen, hide, toggle} = useModal(false);
	return (
		<>
			<button
				type='button'
				className='bg-transparent cursor-pointer'
				onClick={toggle}
			>
				<TrashIcon className='w-5 h-5' />
			</button>

			<Modal header='Delete' isOpen={isOpen} onClose={hide}>
				<div className='flex flex-col w-full h-full items-center text-sm'>
					<p className='pb-3'>Do you want to remove this set?</p>
					<div className='p-2 m-2'>
						<Button
							className='bg-sky-800 dark:bg-sky-800 text-white dark:text-white'
							onClick={onClick}
						>
							Yes
						</Button>

						<Button
							className='bg-sky-800 dark:bg-sky-800 text-white dark:text-white'
							onClick={hide}
						>
							No
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default memo(RemoveModal);
