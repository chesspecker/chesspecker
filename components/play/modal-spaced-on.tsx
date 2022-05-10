import {TrashIcon} from '@heroicons/react/solid';
import Modal from 'react-pure-modal';
import {memo} from 'react';
import useModal from '@/hooks/use-modal';
import {Button} from '@/components/button';
import {Dialog, Transition} from '@headlessui/react';
import {Fragment, useState} from 'react';

import GenericModal from '@/components/modal';

type Props = {
	onClick: () => Promise<void>;
	isOpen: boolean;
	hide: () => void;
};
const SpacedModal = ({onClick, isOpen = false, hide}: Props) => {
	return (
		<GenericModal
			title='Activate spaced repetition'
			hide={hide}
			isOpen={isOpen}
		>
			<div className='w-full mt-2'>
				<p className='text-sm text-gray-500'>
					Congrats on finishing the first step of your journey. <br />
					You can now choose to activate the spaced-repetition mode for this
					set. Instead of playing every puzzle, you will be facing the puzzle
					you had difficulties with.
				</p>
			</div>
			<div className='mt-4'>
				<div className='flex justify-start w-full'>
					<Button
						type='button'
						className='inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={hide}
					>
						No thanks
					</Button>
					<Button
						type='button'
						className='inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						onClick={onClick}
					>
						Activate
					</Button>
				</div>
			</div>
		</GenericModal>
	);
};

export default memo(SpacedModal);
