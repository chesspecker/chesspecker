import {TrashIcon} from '@heroicons/react/solid';
import {memo} from 'react';
import useModal from '@/hooks/use-modal';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';

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
			<GenericModal title='Remove this set' hide={hide} isOpen={isOpen}>
				<div className='w-full mt-2'>
					<p className='text-sm text-gray-500'>Are you sure?</p>
				</div>
				<div className='mt-4'>
					<div className='flex justify-start w-full'>
						<Button
							type='button'
							className='inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
							onClick={hide}
						>
							No
						</Button>
						<Button
							type='button'
							className='inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
							onClick={onClick}
						>
							Yes
						</Button>
					</div>
				</div>
			</GenericModal>
		</>
	);
};

export default memo(RemoveModal);
