import {memo} from 'react';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';

type Props = {
	onClick: () => Promise<void>;
	isOpen: boolean;
	hide: () => void;
};
const ModalSpacedOff = ({onClick, isOpen = false, hide}: Props) => {
	return (
		<GenericModal
			title='Turn off spaced repetition'
			hide={hide}
			isOpen={isOpen}
		>
			<div className='w-full mt-2'>
				<p className='text-sm text-gray-500'>
					Do you want to turn off spaced repetition ? <br />
					You are going to loose all you progress in spaced-repetition mode.
				</p>
			</div>
			<div className='mt-4'>
				<div className='flex justify-start w-full'>
					<Button
						type='button'
						className='inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={hide}
					>
						Go back
					</Button>
					<Button
						type='button'
						className='inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={onClick}
					>
						Desactivate
					</Button>
				</div>
			</div>
		</GenericModal>
	);
};

export default memo(ModalSpacedOff);
