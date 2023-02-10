import {memo} from 'react';
import {useRouter} from 'next/router';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';

type Props = {
	isOpen: boolean;
	hide: () => void;
};
const ModalSpacedEnd = ({isOpen = false, hide}: Props) => {
	const router = useRouter();
	return (
		<GenericModal
			title='Activate spaced repetition'
			hide={hide}
			isOpen={isOpen}
		>
			<div className='mt-2 w-full'>
				<p className='text-sm text-gray-500'>
					Congrats you finished this set with spaced repetition mode.
				</p>
			</div>
			<div className='mt-4'>
				<div className='flex w-full justify-start'>
					<Button
						type='button'
						className='mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={async () => {
							hide();
							return router.push('/dashboard');
						}}
					>
						Dashboard 👉
					</Button>
					<Button
						type='button'
						className='ml-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={() => {
							router.reload();
						}}
					>
						Play again
					</Button>
				</div>
			</div>
		</GenericModal>
	);
};

export default memo(ModalSpacedEnd);
