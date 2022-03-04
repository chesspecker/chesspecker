import Image from 'next/image.js';
import Link from 'next/link';
import {LogoutIcon} from '@heroicons/react/solid';
import logo from '@/public/images/logo.svg';

const Navbar = () => (
	<div className='fixed top-0 flex w-full items-center justify-between bg-sky-700 font-merriweather shadow'>
		<div className='flex cursor-pointer'>
			<Link passHref href='/dashboard'>
				<a>
					<div className='flex'>
						<div className='m-2 max-w-[3.5rem]'>
							{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
							<Image src={logo} />
						</div>
						<p className='ml-1 mr-4 self-center text-sm text-white md:text-lg'>
							— Chesspecker
						</p>
					</div>
				</a>
			</Link>
		</div>
		<div className='mr-8 self-center text-sm text-white md:text-lg'>
			<Link passHref href='/api/auth/logout'>
				<a className='flex'>
					<LogoutIcon className='mr-2 mt-1 h-3 w-3 text-white md:h-5 md:w-5' />
					Logout
				</a>
			</Link>
		</div>
	</div>
);

export default Navbar;
