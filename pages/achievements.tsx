import React, {useState} from 'react';
import type {ReactElement} from 'react';
import {motion} from 'framer-motion';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';

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

const variants = {
	open: {opacity: 1, visibility: 'visible'},
	closed: {opacity: 0, visibility: 'hidden'},
};

const Modal = ({
	showModal,
	setShowModal,
}: {
	showModal: boolean;
	setShowModal: (previous: boolean) => void;
}): JSX.Element => {
	console.log(showModal);
	return (
		<motion.div
			animate={showModal ? 'open' : 'closed'}
			variants={variants}
			className='absolute   z-40 flex h-screen w-screen flex-col items-center justify-center  bg-[rgba(1,1,1,0.6)]'
		>
			<h3 className='mb-5 text-6xl font-bold text-white'>
				New achievement 🎉🔥
			</h3>
			<Card />
			<div className='mt-4 w-1/3'>
				<Button onClick={() => setShowModal(previous => !previous)}>
					Claim
				</Button>
			</div>
		</motion.div>
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
