import {PencilIcon} from '@heroicons/react/24/solid';
import type {Dispatch, SetStateAction} from 'react';
import {memo} from 'react';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';
import {useModal} from '@/hooks/use-modal';

const defaultClasses =
	'mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';

type Props = {
	setTitle: string;
	setSetTitle: Dispatch<SetStateAction<string>>;
	onValidate: () => void;
};
const EditModal = ({setTitle, setSetTitle, onValidate}: Props) => {
	const {isOpen, hide, toggle} = useModal(false);

	return (
		<>
			<button
				type='button'
				className='flex h-min w-min cursor-pointer items-center justify-center rounded-full bg-sky-700 p-1 dark:bg-white'
				onClick={toggle}
			>
				<PencilIcon className='h-5 w-5 text-white dark:text-sky-700' />
			</button>

			<GenericModal title='Edit set name' isOpen={isOpen} hide={hide}>
				<div className='my-8 flex w-full flex-col items-center justify-center overflow-hidden pb-4 text-left md:flex-row'>
					{/* eslint-disable-next-line @shopify/react-require-autocomplete */}
					<input
						id='title'
						className='w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:bg-white focus:outline-none'
						type='text'
						value={setTitle}
						placeholder='ex: Road to 2300 elo :)'
						onChange={event => {
							setSetTitle(event.target.value);
						}}
					/>
				</div>
				<div className='m-2 p-2'>
					<Button className={defaultClasses} onClick={onValidate}>
						Save
					</Button>
				</div>
			</GenericModal>
		</>
	);
};

// eslint-disable-next-line import/no-default-export
export default memo(EditModal);
