import {Menu, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {
	UserIcon,
	HomeIcon,
	PlusIcon,
	ArrowLeftOnRectangleIcon,
	BoltIcon,
	Bars3Icon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';

type BurgerItemProps = {
	href: string;
	icon: JSX.Element;
	text: string;
};

const BurgerItem = ({href, icon, text}: BurgerItemProps) => (
	<Link href={href}>
		<Menu.Item>
			<button
				type='button'
				className='group flex w-full items-center rounded-md p-2 text-sm text-gray-900'
			>
				{icon}
				{text}
			</button>
		</Menu.Item>
	</Link>
);

export const Burger = () => (
	<div className='visible fixed top-5 right-5 z-20 flex w-56 items-end justify-end safe-top sm:hidden'>
		<Menu as='div' className='relative inline-block text-left'>
			<div>
				<Menu.Button className='inline-flex w-full justify-center rounded-md bg-black/20 p-2 text-sm font-medium hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
					<Bars3Icon
						className='h-5 w-5 hover:text-violet-100'
						aria-hidden='true'
					/>
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
					<BurgerItem
						href='/user'
						icon={<UserIcon className='mr-2 h-5 w-5 text-sky-700' />}
						text='Profile'
					/>

					<BurgerItem
						href='/dashboard'
						icon={<HomeIcon className='mr-2 h-5 w-5 text-sky-700' />}
						text='Dashboard'
					/>

					<BurgerItem
						href='/api/auth/logout'
						icon={
							<ArrowLeftOnRectangleIcon className='mr-2 h-5 w-5 text-sky-700' />
						}
						text='Logout'
					/>

					<BurgerItem
						href='/create'
						icon={<PlusIcon className='mr-2 h-5 w-5 text-sky-700' />}
						text='New set'
					/>

					<BurgerItem
						href='/achievements'
						icon={<BoltIcon className='mr-2 h-5 w-5 text-sky-700' />}
						text='Achievements'
					/>
				</Menu.Items>
			</Transition>
		</Menu>
	</div>
);
