import {Fragment, Dispatch, SetStateAction} from 'react';
import {Transition} from '@headlessui/react';
import {XIcon} from '@heroicons/react/solid';
import Link from 'next/link';

type Props = {
	text: string;
	show: boolean;
	url: string;
	setShow: Dispatch<SetStateAction<boolean>>;
};

export default function Notification({text, show, url, setShow}: Props) {
	return (
		<div
			aria-live='assertive'
			className='pointer-events-none fixed inset-0 z-20 flex items-end px-4 py-6 sm:items-start sm:p-6'
		>
			<div className='flex w-full flex-col items-center space-y-4 sm:items-end'>
				<Transition
					show={show}
					as={Fragment}
					enter='transform ease-out duration-300 transition'
					enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
					enterTo='translate-y-0 opacity-100 sm:translate-x-0'
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
						<div className='p-4'>
							<div className='flex items-center'>
								<div className='flex w-0 flex-1 justify-between'>
									<p className='w-0 flex-1 text-sm font-medium text-gray-900'>
										{text}
									</p>
									<Link href={url}>
										<a>
											<button
												type='button'
												className='ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
											>
												Discover
											</button>
										</a>
									</Link>
								</div>
								<div className='ml-4 flex flex-shrink-0'>
									<button
										className='inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
										onClick={() => {
											setShow(false);
										}}
									>
										<span className='sr-only'>Close</span>
										<XIcon className='h-5 w-5' aria-hidden='true' />
									</button>
								</div>
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	);
}
