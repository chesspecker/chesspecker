import Image from 'next/image.js';
import Link from 'next/link';
import logo from '@/public/images/logo.svg';

const Navbar = () => (
	<div className='fixed top-0 flex w-full items-center justify-between bg-sky-700 font-merriweather shadow'>
		<div className='flex cursor-pointer text-3xl'>
			<Link href='/dashboard'>
				<div className='flex'>
					<div className='m-2 max-w-[3.5rem]'>
						<Image src={logo} />
					</div>
					<p className='mr-4 self-center text-xl text-white'> — Chesspecker</p>
				</div>
			</Link>
		</div>
		<div className='mr-8 self-center text-xl text-white'>
			<a href={`${process.env.API}/auth/logout`}>Logout</a>
		</div>
	</div>
);

export default Navbar;
