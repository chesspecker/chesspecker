import Image from 'next/image.js';
import Link from 'next/link';
import {LogoutIcon} from '@heroicons/react/solid';
import {useState, useEffect} from 'react';
import Burger from './mobile-assets/burger';
import logo from '@/public/images/logo.svg';
import useUser from '@/hooks/use-user';
import {UserInterface} from '@/types/models';

const Navbar = () => {
	const [user, setUser] = useState<UserInterface>();
	const data = useUser();

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
	}, [data]);

	return (
		<>
			<Burger user={user} />
			<div className='fixed top-0 z-10 items-center justify-between hidden w-full font-sans shadow sm:flex bg-sky-700 sm:visible'>
				<div className='flex cursor-pointer'>
					<Link passHref href='/dashboard'>
						<a>
							<div className='flex'>
								<div className='m-2 max-w-[3.5rem]'>
									{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
									<Image src={logo} />
								</div>
								<p className='self-center hidden ml-1 mr-4 text-sm text-white sm:block md:text-lg'>
									— Chesspecker
								</p>
							</div>
						</a>
					</Link>
				</div>
				<div className='self-center mr-8 text-lg text-white'>
					<div className='flex'>
						<Link passHref href='/user/'>
							<a className='flex items-center justify-center mr-5'>
								{user?.isSponsor && <span>👑&nbsp;</span>}
								{user?.username}
							</a>
						</Link>
						<Link passHref href='/api/auth/logout'>
							<a className='flex'>
								<LogoutIcon className='w-3 h-3 mt-1 mr-2 text-white md:h-5 md:w-5' />
								Logout
							</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
