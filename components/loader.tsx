import React, {Fragment} from 'react';
import Image from 'next/image';
import {Transition} from '@headlessui/react';

const Loader = ({isVisible}: {isVisible: boolean}) => {
	return (
		<Transition show={isVisible ? isVisible : false}>
			<Transition.Child
				as={Fragment}
				enter=' transition duration-[200ms]'
				enterFrom=' hidden '
				enterTo=' visible '
				leave=' transition duration-[200ms]'
				leaveFrom=' visible  '
				leaveTo=' hidden  '
			>
				<div className=' h-screen w-screen fixed top-0 left-0 z-40 '>
					<Transition.Child
						as={Fragment}
						enter='transform transition duration-[200ms]'
						enterFrom=' opacity-0 '
						enterTo='opacity-100  '
						leave='transform transition duration-[200ms]'
						leaveFrom='opacity-100  '
						leaveTo='opacity-0   '
					>
						<div
							className={`  m-0 flex w-full h-full flex-col items-center justify-center text-slate-800  bg-sky-700 bg-gradient-to-t from-slate-900 to-sky-700  `}
						>
							<Transition.Child
								as={Fragment}
								enter='transform transition duration-[200ms]'
								enterFrom='opacity-0 rotate-[-120deg] scale-50'
								enterTo='opacity-100 rotate-0 scale-100'
								leave='transform duration-200 transition ease-in-out'
								leaveFrom='opacity-100 rotate-0 scale-100 '
								leaveTo='opacity-0 scale-95 '
							>
								<div className='animate-pulse'>
									<Image
										className='mx-auto mt-8 block h-40 w-40'
										src='/images/logo.svg'
										width='160px'
										height='160px'
									/>
								</div>
							</Transition.Child>
						</div>
					</Transition.Child>
				</div>
			</Transition.Child>
		</Transition>
	);
};

export default Loader;
