import {PencilIcon} from '@heroicons/react/solid';
import {Dispatch, memo, SetStateAction} from 'react';
import useModal from '@/hooks/use-modal';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';

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
				className='dark:bg-white bg-sky-700 flex items-center justify-center w-min h-min rounded-full p-1 cursor-pointer'
				onClick={toggle}
			>
				<PencilIcon className='w-5 h-5 dark:text-sky-700 text-white' />
			</button>

			<GenericModal title='Edit set name' isOpen={isOpen} hide={hide}>
				<div className='flex flex-col items-center justify-center w-full pb-4 my-8 overflow-hidden text-left md:flex-row'>
					<input
						id='title'
						className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white'
						type='text'
						value={setTitle}
						placeholder='ex: Road to 2300 elo :)'
						onChange={event => {
							setSetTitle(event.target.value);
						}}
					/>
				</div>
				<div className='p-2 m-2'>
					<Button className={defaultClasses} onClick={onValidate}>
						Save
					</Button>
				</div>
			</GenericModal>
		</>
	);
};

export default memo(EditModal);
