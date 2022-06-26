import Image from 'next/image';
import Link from 'next/link';
import {LogoutIcon, MoonIcon, SunIcon} from '@heroicons/react/solid';
import {useState} from 'react';
import {useAtom} from 'jotai';
import Burger from './mobile-assets/burger';
import logo from '@/public/images/logo.svg';
import {User} from '@/models/user';
import {darkModeµ} from '@/lib/atoms';
import {getUser} from '@/lib/api-helpers';
import useEffectAsync from '@/hooks/use-effect-async';

export const BtnToggle = () => {
	const [darkMode, setDarkMode] = useAtom(darkModeµ);

	return (
		<button
			className='flex items-center justify-center pl-2 transition-all'
			aria-label='Toggle Dark Mode'
			type='button'
		>
			{darkMode ? (
				<SunIcon
					className='w-5 h-5 text-yellow-400'
					onClick={() => {
						setDarkMode(() => false);
					}}
				/>
			) : (
				<MoonIcon
					className='w-5 h-5 text-yellow-400'
					onClick={() => {
						setDarkMode(() => true);
					}}
				/>
			)}
		</button>
	);
};

const Navbar = () => {
	const [user, setUser] = useState<User>();

	useEffectAsync(async () => {
		const response = await getUser();
		if (response.success) setUser(() => response.data);
	}, []);

	return (
		<>
			<Burger />
			<div className='fixed top-0 z-10 items-center justify-between hidden w-full font-sans bg-white shadow sm:flex dark:bg-sky-700 sm:visible'>
				<div className='flex cursor-pointer'>
					<Link href='/dashboard'>
						<a>
							<div className='flex'>
								<div className='m-2 max-w-[3.5rem]'>
									<Image src={logo as string} />
								</div>
								<p className='self-center hidden ml-1 mr-4 text-sm sm:block md:text-lg'>
									— Chesspecker
								</p>
							</div>
						</a>
					</Link>
				</div>
				<div className='self-center mr-8 text-lg '>
					<div className='flex'>
						<Link href='/user'>
							<a className='flex items-center justify-center mr-5'>
								{user?.isSponsor && <span>👑&nbsp;</span>}
								{user?.username}
							</a>
						</Link>

						<Link href='/api/auth/logout'>
							<a className='flex'>
								<LogoutIcon className='w-3 h-3 mt-1 mr-2 md:h-5 md:w-5' />
								Logout
							</a>
						</Link>
						<BtnToggle />
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
