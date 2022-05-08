import {Fragment, Dispatch, SetStateAction} from 'react';
import {Transition} from '@headlessui/react';
import {XIcon} from '@heroicons/react/solid';
import Link from 'next/link';

type Props = {
	text: string;
	isVisible: boolean;
	url: string;
	setShow: Dispatch<SetStateAction<boolean>>;
};
const Notification = ({text, isVisible, url, setShow}: Props) => {
	return (
		<div
			aria-live='assertive'
			className='fixed inset-0 z-20 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6'
		>
			<div className='flex flex-col items-center w-full space-y-4 sm:items-end'>
				<Transition
					show={isVisible}
					as={Fragment}
					enter='transform ease-out duration-300 transition'
					enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
					enterTo='translate-y-0 opacity-100 sm:translate-x-0'
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5'>
						<div className='p-4'>
							<div className='flex items-center'>
								<div className='flex justify-between flex-1 w-0'>
									<p className='flex-1 w-0 text-sm font-medium text-gray-900'>
										{text}
									</p>
									<Link href={url}>
										<a>
											<button
												type='button'
												className='flex-shrink-0 ml-3 text-sm font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
											>
												Discover
											</button>
										</a>
									</Link>
								</div>
								<div className='flex flex-shrink-0 ml-4'>
									<button
										type='button'
										className='inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
										onClick={() => {
											setShow(false);
										}}
									>
										<span className='sr-only'>Close</span>
										<XIcon className='w-5 h-5' aria-hidden='true' />
									</button>
								</div>
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	);
};

export default Notification;
