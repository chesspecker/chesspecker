import Image from 'next/image';
import Link from 'next/link';
import {MoonIcon, SunIcon} from '@heroicons/react/solid';
import {useState} from 'react';
import {useAtom} from 'jotai';
import Burger from './mobile-assets/burger';
import type {User} from '@/models/user';
import {darkModeµ} from '@/lib/atoms';
import {getUser} from '@/lib/api-helpers';
import useEffectAsync from '@/hooks/use-effect-async';
import logo from '@/public/images/logo.svg';

export const BtnToggle = () => {
	const [darkMode, setDarkMode] = useAtom(darkModeµ);

	return (
		<button
			className='flex items-center justify-center pl-4 transition-all'
			aria-label='Toggle Dark Mode'
			type='button'
		>
			{darkMode ? (
				<SunIcon
					className='h-5 w-5 text-yellow-400'
					onClick={() => {
						setDarkMode(() => false);
					}}
				/>
			) : (
				<MoonIcon
					className='h-5 w-5 text-yellow-400'
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
			<div className='fixed top-0 z-10 hidden w-full items-center justify-between bg-white font-sans shadow dark:bg-sky-700 sm:visible sm:flex'>
				<div className='flex cursor-pointer'>
					<Link href='/dashboard'>
						<a>
							<div className='flex'>
								<div className='m-2 max-w-[3.5rem]'>
									<Image src={logo as string} />
								</div>
								<p className='text-md ml-1 mr-4 hidden self-center sm:block md:text-lg'>
									— Chesspecker
								</p>
							</div>
						</a>
					</Link>
				</div>
				<div className='mr-8 self-center text-lg '>
					<div className='flex'>
						<Link href='/user'>
							<a className='mr-5 flex items-center justify-center'>
								{user?.isSponsor && <span>👑&nbsp;</span>}
								{user?.username}
							</a>
						</Link>

						<Link href='/api/auth/logout'>
							<a className='flex'>logout</a>
						</Link>
						<BtnToggle />
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
