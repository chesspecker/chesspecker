import {Menu, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {
	MenuIcon,
	UserIcon,
	HomeIcon,
	LogoutIcon,
	PlusIcon,
	LightningBoltIcon,
	MoonIcon,
	SunIcon,
} from '@heroicons/react/solid';
import Link from 'next/link';
import {useAtom} from 'jotai';
import {darkModeµ} from '@/lib/atoms';

type BurgerItemProps = {
	href: string;
	icon: JSX.Element;
	text: string;
};

const BurgerItem = ({href, icon, text}: BurgerItemProps) => (
	<Link href={href}>
		<a>
			<Menu.Item>
				<button
					type='button'
					className='flex items-center w-full px-2 py-2 text-sm text-gray-900 rounded-md group'
				>
					{icon}
					{text}
				</button>
			</Menu.Item>
		</a>
	</Link>
);

const Burger = () => {
	const [isDarkMode, setDarkMode] = useAtom(darkModeµ);
	return (
		<div className='fixed z-20 flex items-end justify-end visible w-56 safe-top top-5 right-5 sm:hidden'>
			<Menu as='div' className='relative inline-block text-left'>
				<div>
					<Menu.Button className='inline-flex justify-center w-full p-2 text-sm font-medium bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
						<MenuIcon
							className='w-5 h-5 hover:text-violet-100'
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
					<Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
						<BurgerItem
							href='/user'
							icon={<UserIcon className='w-5 h-5 mr-2 text-sky-700' />}
							text='Profile'
						/>

						<BurgerItem
							href='/dashboard'
							icon={<HomeIcon className='w-5 h-5 mr-2 text-sky-700' />}
							text='Dashboard'
						/>

						<BurgerItem
							href='/api/auth/logout'
							icon={<LogoutIcon className='w-5 h-5 mr-2 text-sky-700' />}
							text='Logout'
						/>

						<BurgerItem
							href='/create'
							icon={<PlusIcon className='w-5 h-5 mr-2 text-sky-700' />}
							text='New set'
						/>

						<BurgerItem
							href='/achievements'
							icon={<LightningBoltIcon className='w-5 h-5 mr-2 text-sky-700' />}
							text='Achievements'
						/>
						<Menu.Item>
							<button
								type='button'
								className='flex items-center w-full px-2 py-2 text-sm text-gray-900 rounded-md group'
								onClick={() => {
									setDarkMode(previous => !previous);
								}}
							>
								{isDarkMode ? (
									<SunIcon
										className='w-5 h-5 mr-2 text-yellow-400 '
										onClick={() => {
											setDarkMode(() => false);
										}}
									/>
								) : (
									<MoonIcon
										className='w-5 h-5 mr-2 text-sky-700 '
										onClick={() => {
											setDarkMode(() => true);
										}}
									/>
								)}
								{isDarkMode ? 'Light Mode' : 'Dark Mode'}
							</button>
						</Menu.Item>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
};

export default Burger;
