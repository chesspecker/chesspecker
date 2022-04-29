import {Menu, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {
	MenuIcon,
	UserIcon,
	HomeIcon,
	LogoutIcon,
	PlusIcon,
	LightningBoltIcon,
} from '@heroicons/react/solid';
import Link from 'next/link';
import {UserInterface} from '@/types/models';

type BurgerProps = {
	user: UserInterface;
};

type MenuProps = {
	/* eslint-disable-next-line react/no-unused-prop-types */
	active: boolean;
};

const Burger = ({user}: BurgerProps) => {
	return (
		<div className='safe-top w-56 flex items-end justify-end fixed top-5 right-5 visible sm:hidden z-20'>
			<Menu as='div' className='relative inline-block text-left '>
				<div>
					<Menu.Button className=' p-2 inline-flex justify-center w-full text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
						<MenuIcon
							className='w-5 h-5   text-white hover:text-violet-100'
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
						<Link passHref href={`/user/${user?._id.toString()}`}>
							<Menu.Item>
								{({active}: MenuProps) => (
									<button
										type='button'
										className={`${
											active ? ' text-white bg-blue-200' : 'text-gray-900'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
									>
										<UserIcon className='w-5 h-5 mr-2 text-sky-700 ' />
										Profil
									</button>
								)}
							</Menu.Item>
						</Link>
						<Link passHref href='/dashboard'>
							<Menu.Item>
								{({active}: MenuProps) => (
									<button
										type='button'
										className={`${
											active ? 'bg-blue-200 text-white' : 'text-gray-900'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
									>
										<HomeIcon className='w-5 h-5 mr-2 text-sky-700 ' />
										Dashboard
									</button>
								)}
							</Menu.Item>
						</Link>

						<Link passHref href='/api/auth/logout'>
							<Menu.Item>
								{({active}: MenuProps) => (
									<button
										type='button'
										className={`${
											active ? 'bg-blue-200 text-white' : 'text-gray-900'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
									>
										<LogoutIcon className='w-5 h-5 mr-2 text-sky-700 ' />
										Logout
									</button>
								)}
							</Menu.Item>
						</Link>
						<Link passHref href='/create'>
							<Menu.Item>
								{({active}: MenuProps) => (
									<button
										type='button'
										className={`${
											active ? 'bg-blue-200 text-white' : 'text-gray-900'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
									>
										<PlusIcon className='w-5 h-5 mr-2 text-sky-700 ' />
										New set
									</button>
								)}
							</Menu.Item>
						</Link>

						<Link passHref href={`/achievements/${user?._id.toString()}`}>
							<Menu.Item>
								{({active}: MenuProps) => (
									<button
										type='button'
										className={`${
											active ? 'bg-blue-200 text-white' : 'text-gray-900'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
									>
										<LightningBoltIcon className='w-5 h-5 mr-2 text-sky-700 ' />
										Achievements
									</button>
								)}
							</Menu.Item>
						</Link>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
};

export default Burger;
