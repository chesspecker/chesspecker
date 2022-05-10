import {Dispatch, Fragment, SetStateAction} from 'react';
import {Transition} from '@headlessui/react';
import {useRouter} from 'next/router';
import {Button} from '@/components/button';

export type Stat = {time: number; mistakes: number; grade: string};
type Props = {
	stat: Stat;
	/* eslint-disable-next-line react/boolean-prop-naming */
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
};
const ModalPuzzle = ({showModal, stat, setShowModal}: Props): JSX.Element => {
	const router = useRouter();
	return (
		<Transition
			as={Fragment}
			show={showModal}
			enter='transform transition duration-[400ms]'
			enterFrom='opacity-0'
			enterTo='opacity-100'
			leave='transform duration-200 transition ease-in-out'
			leaveFrom='opacity-100'
			leaveTo='opacity-0'
		>
			<div className='absolute z-40 flex flex-col items-center justify-center w-screen min-h-screen -mt-10 bg-black bg-opacity-80'>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<h3 className='mb-5 text-6xl font-bold text-center '>
						Congrats 🎉🔥
					</h3>
				</Transition.Child>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<p className='text-center text-md sm:text-xl'>
						Your grade is {stat.grade} <br />
						You spent {stat.time} seconds. <br />
						You completed it with {stat.mistakes} mistakes.
					</p>
				</Transition.Child>
				<div className='w-1/3 mt-4'>
					<Button
						className='mb-4'
						onClick={() => {
							setShowModal(() => false);
							router.reload();
						}}
					>
						PLAY AGAIN ⚔️
					</Button>
					<Button
						onClick={async () => {
							setShowModal(() => false);
							return router.push('/dashboard');
						}}
					>
						LEAVE 🧨
					</Button>
				</div>
			</div>
		</Transition>
	);
};

export default ModalPuzzle;
