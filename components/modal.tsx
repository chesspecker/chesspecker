import {memo, ReactNode, Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';

type Props = {
	isOpen: boolean;
	hide: () => void;
	children: ReactNode;
	title: string;
};
const GenericModal = ({isOpen, hide, title, children}: Props) => {
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={hide}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black bg-opacity-25' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-full p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
								<Dialog.Title
									as='h3'
									className='flex items-center w-full text-lg font-medium leading-6 text-center text-gray-900'
								>
									{title}
								</Dialog.Title>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default memo(GenericModal);
