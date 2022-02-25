import Image from 'next/image.js';
import Link from 'next/link';
import {LogoutIcon} from '@heroicons/react/solid';
import logo from '@/public/images/logo.svg';
import {origin} from '@/config';
import useUserName from '@/hooks/use-username';

const Navbar = () => (
	<div className='fixed top-0 flex w-full items-center justify-between bg-sky-700 font-merriweather shadow'>
		<div className='flex cursor-pointer'>
			<Link href='/dashboard'>
				<div className='flex'>
					<div className='m-2 max-w-[3.5rem]'>
						<Image src={logo} />
					</div>
					<p className='mr-4 self-center text-lg text-white'> — Chesspecker</p>
				</div>
			</Link>
		</div>
		<div className='mr-8 self-center text-lg text-white'>
			<div className='flex'>
				<Link href='/profile'>
					<a className='mr-5 flex items-center justify-center'>
						<span>⚔️&nbsp;</span>
						{useUserName()?.data?.name}
					</a>
				</Link>
				<Link href='/api/auth/logout'>
					<a className='flex'>
						<LogoutIcon className='mr-2 mt-1 h-5 w-5 text-white' />
						Logout
					</a>
				</Link>
			</div>
		</div>
	</div>
);

export default Navbar;
