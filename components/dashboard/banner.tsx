import React from 'react';
import {SpeakerphoneIcon, XIcon} from '@heroicons/react/solid';
import Link from 'next/link';

type Props = {
	children: React.ReactNode;
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const Banner = ({children, setIsVisible}: Props) => {
	return (
		<div className='w-full absolute top-24 left-0 '>
			<div className='bg-sky-600 w-full block'>
				<div className='max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between flex-wrap'>
						<div className='w-0 flex-1 flex items-center'>
							<span className='flex p-2 rounded-lg bg-sky-800'>
								<SpeakerphoneIcon
									className='h-5 w-5 text-white'
									aria-hidden='true'
								/>
							</span>
							<p className='ml-3 font-medium text-white truncate'>
								<span className='md:inline'>{children}</span>
							</p>
						</div>
						<div className='order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto'>
							<Link href='/sponsor' prefetch>
								<a
									href='#'
									className='flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-sky-600 bg-white hover:bg-sky-50'
								>
									Learn more
								</a>
							</Link>
						</div>
						<div className='order-2 flex-shrink-0 sm:order-3 sm:ml-3'>
							<button
								type='button'
								className='-mr-1 flex p-2 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2'
								onClick={() => {
									setIsVisible(() => false);
								}}
							>
								<span className='sr-only'>Dismiss</span>
								<XIcon className='h-5 w-5' aria-hidden='true' />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export {Banner};
