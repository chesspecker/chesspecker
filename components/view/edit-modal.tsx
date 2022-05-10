import {PencilIcon} from '@heroicons/react/solid';
import Modal from 'react-pure-modal';
import {Dispatch, memo, SetStateAction} from 'react';
import useModal from '@/hooks/use-modal';
import {Button} from '@/components/button';

const defaultClasses =
	'block cursor-default self-center border border-none border-transparent bg-opacity-70 px-2.5 py-2 text-center font-sans text-sm md:text-lg font-bold shadow-sm mx-auto md:mx-2 w-36 rounded-md bg-gray-800 leading-8 m-2';

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

			<Modal header='Edit' isOpen={isOpen} onClose={hide}>
				<div className='flex flex-col items-center justify-center text-sm'>
					<p className='pb-3'>Edit set name</p>
					<div className='flex flex-col items-center justify-center w-full pb-4 my-8 overflow-hidden text-left md:flex-row'>
						<input
							id='title'
							className='box-border block w-1/2 h-10 py-1 m-0 mt-2 text-base font-semibold bg-white bg-no-repeat rounded-md shadow-lg appearance-none text-stone-700 hover:border-neutral-500 focus:outline-none focus-visible:border-stone-400 sm:text-sm md:mt-0'
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
				</div>
			</Modal>
		</>
	);
};

export default memo(EditModal);
