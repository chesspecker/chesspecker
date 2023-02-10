import React from 'react';
import {SpeakerphoneIcon, XIcon} from '@heroicons/react/solid';
import Link from 'next/link';

type Props = {
	children: React.ReactNode;
	handleCloseBanner: () => void;
};

const Banner = ({children, handleCloseBanner}: Props) => (
	<div className='absolute top-24 left-0 w-full '>
		<div className='block w-full bg-sky-600'>
			<div className='mx-auto max-w-7xl p-3 sm:px-6 lg:px-8'>
				<div className='flex flex-wrap items-center justify-between'>
					<div className='flex w-0 flex-1 items-center'>
						<span className='flex rounded-lg bg-sky-800 p-2'>
							<SpeakerphoneIcon
								className='h-5 w-5 text-white'
								aria-hidden='true'
							/>
						</span>
						<p className='ml-3 truncate font-medium text-white'>
							<span className='md:inline'>{children}</span>
						</p>
					</div>
					<div className='order-3 mt-2 w-full shrink-0 sm:order-2 sm:mt-0 sm:w-auto'>
						<Link href='/sponsor'>
							<a className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-sky-600 shadow-sm hover:bg-sky-50'>
								Learn more
							</a>
						</Link>
					</div>
					<div className='order-2 shrink-0 sm:order-3 sm:ml-3'>
						<button
							type='button'
							className='-mr-1 flex rounded-md p-2 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2'
							onClick={() => {
								handleCloseBanner();
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

export {Banner};
