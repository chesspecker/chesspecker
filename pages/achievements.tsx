import React, {useState, Fragment, ReactElement} from 'react';

import {motion, Variants} from 'framer-motion';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import {Transition} from '@headlessui/react';

const Card = () => {
	return (
		<div className=' m-2 flex h-96 w-64 flex-col rounded-lg border border-white bg-white p-2 '>
			<div className=' flex h-1/2 w-full items-center justify-center rounded-lg bg-sky-700'>
				<p className='text-9xl'>🐇</p>
			</div>
			<div className=' flex h-1/2 w-full flex-col   '>
				<h4 className='mt-2 text-xl font-bold'>Rabbit - Master</h4>
				<p className='mt-2 text-black'>
					series of 20 puzzles in less than 5 seconds
				</p>
			</div>
		</div>
	);
};

const variants: Variants = {
	open: {opacity: 1, visibility: 'visible'},
	closed: {opacity: 0, visibility: 'hidden'},
};

const Modal = ({
	showModal,
	setShowModal,
}: {
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
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
			{
				//juste j'ai toujours cette merde de backgroud qui ne prend pas toute la place disponible, elle reste dans son container qui à une margin top
				// chelou jsp trop
				// maintenant ce qui serait stylé c'est d'avoir quand tu play et que tu deblock un achievement tu as un truc avec une  c'est la ou daisyUi est ouf...
				// tu peux le faire avec headless ui aussi en soit c'est juste une div en haut à droite avec une transition https://daisyui.com/components/indicator/
			}
			<div className='absolute z-40 -mt-20 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-60'>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100 '
					leaveTo='opacity-0 scale-95 '
				>
					<h3 className='mb-5 text-6xl font-bold text-white'>
						New achievement 🎉🔥
					</h3>
				</Transition.Child>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100 '
					leaveTo='opacity-0 scale-95 '
				>
					<Card />
				</Transition.Child>

				<div className='mt-4 w-1/3'>
					<Button
						onClick={() => {
							setShowModal(previous => !previous);
						}}
					>
						Claim
					</Button>
				</div>
			</div>
		</Transition>
	);
};

const Achievments = () => {
	const [showModal, setShowModal] = useState(false);
	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<Modal showModal={showModal} setShowModal={setShowModal} />
			<Button
				onClick={() => {
					setShowModal(previous => !previous);
				}}
			>
				Showmodal{' '}
			</Button>
		</div>
	);
};

Achievments.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Achievments;
