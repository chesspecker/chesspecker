import Image from 'next/image.js';
import Link from 'next/link';
import {LogoutIcon} from '@heroicons/react/solid';
import logo from '@/public/images/logo.svg';

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
			<a href={`${process.env.API}/auth/logout`} className='flex'>
				<LogoutIcon className='mr-2 mt-1 h-5 w-5 text-white' />
				Logout
			</a>
		</div>
	</div>
);

export default Navbar;
