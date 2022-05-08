import {TrashIcon} from '@heroicons/react/solid';
import Modal from 'react-pure-modal';
import {memo} from 'react';
import useModal from '@/hooks/use-modal';
import {Button} from '@/components/button';

const defaultClasses =
	'block cursor-default self-center border border-none border-transparent bg-opacity-70 px-2.5 py-2 text-center font-sans text-sm md:text-lg font-bold shadow-sm mx-auto md:mx-2 w-36 rounded-md bg-gray-800 text-white leading-8 m-2';

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
				<div className='flex flex-col items-center text-sm'>
					<p className='pb-3'>Do you want to remove this set?</p>
					<div className='p-2 m-2'>
						<Button className={defaultClasses} onClick={onClick}>
							Yes
						</Button>

						<Button className={defaultClasses} onClick={hide}>
							No
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default memo(RemoveModal);
