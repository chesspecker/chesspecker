import {memo} from 'react';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';
import {useRouter} from 'next/router';

type Props = {
	isOpen: boolean;
	hide: () => void;
};
const ModalSpacedOff = ({isOpen = false, hide}: Props) => {
	const router = useRouter();
	return (
		<GenericModal
			title='Activate spaced repetition'
			hide={hide}
			isOpen={isOpen}
		>
			<div className='w-full mt-2'>
				<p className='text-sm text-gray-500'>
					Congrats you finished this set with spaced repetition mode. <br />
				</p>
			</div>
			<div className='mt-4'>
				<div className='flex justify-start w-full'>
					<Button
						type='button'
						className='inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={async () => {
							hide();
							return router.push('/dashboard');
						}}
					>
						Dashboard 👉
					</Button>
					<Button
						type='button'
						className='inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={() => router.reload()}
					>
						Play again
					</Button>
				</div>
			</div>
		</GenericModal>
	);
};

export default memo(ModalSpacedOff);
