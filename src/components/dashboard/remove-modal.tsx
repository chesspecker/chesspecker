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
				className='flex cursor-pointer bg-transparent'
				onClick={toggle}
			>
				<TrashIcon className='h-5 w-5' />
			</button>
			<GenericModal title='Remove this set' hide={hide} isOpen={isOpen}>
				<div className='mt-2 w-full'>
					<p className='text-sm text-gray-500'>Are you sure?</p>
				</div>
				<div className='mt-4'>
					<div className='flex w-full justify-start'>
						<Button
							type='button'
							className='mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
							onClick={hide}
						>
							No
						</Button>
						<Button
							type='button'
							className='ml-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
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
