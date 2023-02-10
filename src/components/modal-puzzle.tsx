import type {Dispatch, SetStateAction} from 'react';
import {Fragment} from 'react';
import {Transition} from '@headlessui/react';
import {useRouter} from 'next/router';
import {Button, ButtonLink} from '@/components/button';
import type {Puzzle} from '@/models/puzzle';

export type Stat = {time: number; mistakes: number; grade: string};
type Props = {
	stat: Stat;
	puzzle: Puzzle;
	/* eslint-disable-next-line react/boolean-prop-naming */
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	random?: Puzzle['PuzzleId'];
};
const ModalPuzzle = ({
	showModal,
	stat,
	setShowModal,
	puzzle,
	random,
}: Props): JSX.Element => {
	const router = useRouter();

	const handleReload = () => {
		setShowModal(() => false);
		router.reload();
	};

	const handleRandom = async () => {
		setShowModal(() => false);
		await router.push(`/play/puzzle/${random ?? 'qbsiJ'}`);
	};

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
			<div className='absolute z-40 -mt-10 flex min-h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-80'>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<h3 className='mb-5 text-center text-6xl font-bold text-white '>
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
					<p className='text-md text-center text-white sm:text-xl'>
						Your grade is {stat.grade} <br />
						You spent {stat.time} seconds. <br />
						You completed it with {stat.mistakes} mistakes.
					</p>
				</Transition.Child>
				<div className='mt-4 w-1/3'>
					<Button onClick={handleReload}>PLAY IT AGAIN ⚔️</Button>
					<Button onClick={handleRandom}>PLAY RANDOM PUZZLE 🧨</Button>
					<ButtonLink href={`https://lichess.org/training/${puzzle.PuzzleId}`}>
						VIEW ON LICHESS
					</ButtonLink>
				</div>
			</div>
		</Transition>
	);
};

export default ModalPuzzle;
